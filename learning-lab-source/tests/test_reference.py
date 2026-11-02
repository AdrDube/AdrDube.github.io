"""Execute the actual displayed Python functions and real SQLite behavior."""
import json, subprocess, unittest, sqlite3, tempfile
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from threading import Barrier
from dataclasses import FrozenInstanceError
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads(subprocess.check_output(['node','--experimental-strip-types','-e',"import('./lib/curriculum.ts').then(m=>console.log(JSON.stringify(m.lessons)))"],cwd=ROOT,text=True))
BY_ID={l['id']:l for l in DATA}
def namespace(lesson,index):
    result={}
    exec(BY_ID[lesson]['steps'][index]['code'],result)
    return result
class ReferenceTests(unittest.TestCase):
    def test_generator(self):
        fn=namespace('codes',2)['generate_code']
        for r,expected in [(0,'00000'),(.00042,'00042'),(.999999,'99999')]:
            self.assertEqual(fn(lambda:r),expected)
        for r in [-.1,1]:
            with self.assertRaises(ValueError): fn(lambda:r)
    def test_matching(self):
        fn=namespace('matching',2)['matches']
        self.assertEqual(fn('11223','12345'),1)
        self.assertEqual(fn('00000','00000'),5)
        for bad in ['1234','１２３４５','12x45']:
            with self.assertRaises(ValueError): fn(bad,'12345')
    def test_payouts(self):
        fn=namespace('payouts',3)['payout']
        self.assertEqual(fn(1002000,{4:3,2:1}),({4:133600,2:50100},551100))
        self.assertEqual(fn(1002500,{4:3,2:1}),({4:133666,2:50125},551377))
        self.assertEqual(fn(1001000,{5:1,4:1}),({5:1001000},0))
        self.assertEqual(fn(1000000,{}),({},1000000))
    def test_snapshot(self):
        ns=namespace('snapshot',1);Entry,Draw=ns['Entry'],ns['Draw']
        entries=[Entry(1,'00042')];draw=Draw(tuple(entries),1000500)
        entries.append(Entry(2,'99999'))
        self.assertEqual(len(draw.entries),1)
        with self.assertRaises(FrozenInstanceError):draw.entries[0].code='11111'
        with self.assertRaises(FrozenInstanceError):draw.pot_cents=0
    def test_overlap(self):
        fn=namespace('overlap',1)['overlaps']
        self.assertFalse(fn(9,10,10,11));self.assertTrue(fn(9,12,10,11))
        with self.assertRaises(ValueError):fn(9,9,10,11)
    def test_cache_selection(self):
        fn=namespace('cache',2)['choose_victim']
        data={'A':{'count':3,'last':3},'B':{'count':1,'last':4}}
        self.assertEqual(fn(data,'LRU'),'A');self.assertEqual(fn(data,'LFU'),'B')
    def test_actual_sqlite_concurrent_connections(self):
        # Use the exact teaching schema and insert/reload snippet, wrapped in a function.
        ns={};code=BY_ID['calendar']['steps'][3]['code']
        exec('def submit(connection, requester, key):\n'+''.join('    '+line+'\n' for line in code.splitlines()),ns)
        submit=ns['submit']
        with tempfile.TemporaryDirectory() as tmp:
            db=Path(tmp)/'requests.db'
            with sqlite3.connect(db) as c:c.executescript(BY_ID['calendar']['steps'][2]['code'])
            barrier=Barrier(2)
            def call():
                with sqlite3.connect(db,timeout=5) as c:
                    barrier.wait(timeout=5)
                    return submit(c,'Mina','key-7')
            with ThreadPoolExecutor(2) as pool:
                ids=list(pool.map(lambda _:call(),range(2)))
            self.assertEqual(ids[0],ids[1])
            with sqlite3.connect(db) as c:
                self.assertEqual(c.execute('SELECT count(*) FROM requests').fetchone()[0],1)
                self.assertEqual(submit(c,'Mina','key-7'),ids[0])
                self.assertNotEqual(submit(c,'Jo','key-7'),ids[0])
                with self.assertRaises(sqlite3.IntegrityError):submit(c,None,'key-7')
    def test_deterministic_broken_interleaving(self):
        # Separate connections both finish the empty lookup before either inserts.
        with tempfile.TemporaryDirectory() as tmp:
            db=Path(tmp)/'broken.db'
            with sqlite3.connect(db) as c:c.execute('CREATE TABLE requests(id INTEGER PRIMARY KEY, requester TEXT, request_key TEXT)')
            barrier=Barrier(2)
            def broken():
                with sqlite3.connect(db,timeout=5) as c:
                    old=c.execute('SELECT id FROM requests WHERE requester=? AND request_key=?',('Mina','key-7')).fetchone()
                    self.assertIsNone(old)
                    barrier.wait(timeout=5)
                    return c.execute('INSERT INTO requests(requester,request_key) VALUES (?,?)',('Mina','key-7')).lastrowid
            with ThreadPoolExecutor(2) as pool:ids=list(pool.map(lambda _:broken(),range(2)))
            self.assertNotEqual(ids[0],ids[1])
            with sqlite3.connect(db) as c:self.assertEqual(c.execute('SELECT count(*) FROM requests').fetchone()[0],2)
class PatternTests(unittest.TestCase):
    def test_graph(self):
        fn=namespace('graph-search',1)['hops']
        self.assertEqual(fn({'A':['B','C'],'B':['A','C']},'A','C'),1)
        self.assertEqual(fn({},'A','A'),0)
        self.assertIsNone(fn({'A':['A']},'A','Z'))
    def test_dependencies(self):
        fn=namespace('topological',1)['order_tasks']
        self.assertEqual(fn(['A','B','C'],[('A','B'),('B','C')]),['A','B','C'])
        self.assertEqual(fn([],[]),[])
        with self.assertRaises(ValueError):fn(['A','B'],[('A','B'),('B','A')])
    def test_combinations(self):
        fn=namespace('backtracking',1)['combinations']
        self.assertEqual(fn(['A','B','C'],2),[['A','B'],['A','C'],['B','C']])
        self.assertEqual(fn([],0),[[]]);self.assertEqual(fn(['A'],2),[])
        with self.assertRaises(ValueError):fn([], -1)
    def test_greedy(self):
        fn=namespace('greedy',1)['select_meetings']
        self.assertEqual(fn([(0,10),(0,2),(2,4),(4,6)]),[(0,2),(2,4),(4,6)])
    def test_dp(self):
        fn=namespace('dp',1)['fewest_coins']
        self.assertEqual(fn([1,3,4],6),2);self.assertIsNone(fn([2],3))
        self.assertEqual(fn([],0),0)
        with self.assertRaises(ValueError):fn([0],3)
    def test_parsing(self):
        fn=namespace('parsing',1)['parse_order']
        self.assertEqual(fn(' ABC:12 '),('ABC',12))
        for text in ['ABC:0','ABC:-1','abc:2','ABC:2:3','','ABC:１２']:
            with self.assertRaises(ValueError):fn(text)
    def test_lru(self):
        cls=namespace('structure-design',1)['LRU'];c=cls(2)
        c.put('A',1);c.put('B',2);self.assertEqual(c.get('A'),1);c.put('C',3)
        with self.assertRaises(KeyError):c.get('B')
        c.put('A',4);self.assertEqual(c.get('C'),3);self.assertEqual(c.get('A'),4)
        with self.assertRaises(ValueError):cls(0)
    def test_trie(self):
        cls=namespace('tries',1)['Trie'];t=cls();t.insert('car');t.insert('cart')
        self.assertTrue(t.contains('car'));self.assertFalse(t.contains('ca'))
        self.assertTrue(t.has_prefix('ca'));self.assertFalse(t.has_prefix('dog'))
        self.assertTrue(t.has_prefix(''));self.assertFalse(t.contains(''))
        t.insert('');self.assertTrue(t.contains(''))
    def test_collections(self):
        namespace('collections',1)
if __name__=='__main__':unittest.main(verbosity=2)
