import type { Lesson } from './curriculum';
export const patternLessons:Lesson[]=[
  {
    "id": "graph-search",
    "title": "Graph search & pathfinding",
    "subtitle": "Connections, reachability, or fewest hops suggest a graph.",
    "group": "Common patterns",
    "minutes": 20,
    "icon": "",
    "source": "Original refresher • Hello Interview pattern taxonomy",
    "concepts": [
      "Graph",
      "Queue",
      "BFS"
    ],
    "lab": "pattern",
    "steps": [
      {
        "title": "Recognize it in a repository",
        "goal": "Connections, reachability, or fewest hops suggest a graph.",
        "paragraphs": [
          "Connections, reachability, or fewest hops suggest a graph.",
          "Use an adjacency dictionary and deque for BFS. Mark a node seen when enqueuing so cycles do not repeatedly add it. BFS finds fewest edges in an unweighted graph; DFS is useful for reachability. Dijkstra uses a min-heap for nonnegative weighted edges; A* adds a heuristic and needs appropriate correctness conditions. Do not use BFS to minimize arbitrary edge costs. With adjacency lists, BFS is O(V + E) time and O(V) auxiliary space.",
          "Start at the caller and follow one concrete input into the helper. Identify the representation, the state that changes, and the return contract. Ask AI for file and function references before requesting edits."
        ],
        "prompt": "Map the relevant callers, representation, and invariant for Graph search & pathfinding. Do not edit. Explain why this pattern fits and when it would not.",
        "question": "When does BFS guarantee the shortest path?",
        "options": [
          "When every edge has equal cost.",
          "For arbitrary weighted edges."
        ],
        "correct": 0,
        "feedback": "When every edge has equal cost.",
        "hint": "Follow the information the operation must preserve.",
        "takeaway": "Choose a representation from the behavior, then verify it in the actual call path."
      },
      {
        "title": "Trace the implementation",
        "goal": "Predict intermediate state before accepting the result.",
        "paragraphs": [
          "Use an adjacency dictionary and deque for BFS. Mark a node seen when enqueuing so cycles do not repeatedly add it. BFS finds fewest edges in an unweighted graph; DFS is useful for reachability. Dijkstra uses a min-heap for nonnegative weighted edges; A* adds a heuristic and needs appropriate correctness conditions. Do not use BFS to minimize arbitrary edge costs. With adjacency lists, BFS is O(V + E) time and O(V) auxiliary space.",
          "The reference below is deliberately compact. Read it as a helper inside a larger codebase: check its callers and assumptions before reusing it. Explain the state after each iteration or recursive call."
        ],
        "code": "from collections import deque\n\ndef hops(graph, start, target):\n    queue = deque([(start, 0)])\n    seen = {start}\n    while queue:\n        node, distance = queue.popleft()\n        if node == target:\n            return distance\n        for nxt in graph.get(node, []):\n            if nxt not in seen:\n                seen.add(nxt)\n                queue.append((nxt, distance + 1))\n    return None",
        "lines": [
          "Trace one input through each state change.",
          "Identify the termination condition and the returned value."
        ],
        "prompt": "Trace this reference with a tiny input. Show intermediate state, explain complexity, and identify an assumption that its caller must enforce.",
        "question": "When does BFS guarantee the shortest path?",
        "options": [
          "For arbitrary weighted edges.",
          "When every edge has equal cost."
        ],
        "correct": 1,
        "feedback": "When every edge has equal cost.",
        "hint": "Check the contract rather than judging the number of lines.",
        "takeaway": "Be able to explain what each state variable represents."
      },
      {
        "title": "Prove the behavior and bound the change",
        "goal": "Turn likely mistakes into targeted checks.",
        "paragraphs": [
          "Check start equals target → 0, disconnected target → None, a cycle, and two paths of different lengths. Example A→B→C and A→C must return 1 hop from A to C. If costs matter, add a case where fewer edges costs more.",
          "In the repository, add a failing regression test at the narrowest useful boundary, patch that path, and run its caller’s tests too. Ask AI to explain why each test would fail on the suspected bug. A passing example alone does not establish all inputs."
        ],
        "prompt": "Propose focused tests for Graph search & pathfinding. Include a counterexample to a tempting wrong approach, expected results, and the existing behavior that must remain stable.",
        "question": "When does BFS guarantee the shortest path?",
        "options": [
          "When every edge has equal cost.",
          "For arbitrary weighted edges."
        ],
        "correct": 0,
        "feedback": "When every edge has equal cost.",
        "hint": "Choose a case where the wrong approach disagrees with the contract.",
        "takeaway": "Check start equals target → 0, disconnected target → None, a cycle, and two paths of different lengths. Example A→B→C and A→C must return 1 hop from A to C. If costs matter, add a case where fewer edges costs more."
      }
    ]
  },
  {
    "id": "topological",
    "title": "Topological sort",
    "subtitle": "Prerequisites, build order, and dependency pipelines suggest topological sorting.",
    "group": "Common patterns",
    "minutes": 20,
    "icon": "",
    "source": "Original refresher • Hello Interview pattern taxonomy",
    "concepts": [
      "Graph",
      "Indegree",
      "Queue"
    ],
    "lab": "pattern",
    "steps": [
      {
        "title": "Recognize it in a repository",
        "goal": "Prerequisites, build order, and dependency pipelines suggest topological sorting.",
        "paragraphs": [
          "Prerequisites, build order, and dependency pipelines suggest topological sorting.",
          "Kahn’s algorithm counts incoming edges and queues zero-indegree nodes. Here each pair is (prerequisite, dependent), nodes are unique, and every edge endpoint belongs to nodes. Duplicate edges are counted and removed consistently. A cycle leaves nodes unprocessed. Many valid orders may exist; assert dependency order rather than one arbitrary sequence. Time and space are O(V + E).",
          "Start at the caller and follow one concrete input into the helper. Identify the representation, the state that changes, and the return contract. Ask AI for file and function references before requesting edits."
        ],
        "prompt": "Map the relevant callers, representation, and invariant for Topological sort. Do not edit. Explain why this pattern fits and when it would not.",
        "question": "What signals a dependency cycle in Kahn’s algorithm?",
        "options": [
          "Fewer nodes are processed than exist.",
          "Every task must have exactly one prerequisite."
        ],
        "correct": 0,
        "feedback": "Fewer nodes are processed than exist.",
        "hint": "Follow the information the operation must preserve.",
        "takeaway": "Choose a representation from the behavior, then verify it in the actual call path."
      },
      {
        "title": "Trace the implementation",
        "goal": "Predict intermediate state before accepting the result.",
        "paragraphs": [
          "Kahn’s algorithm counts incoming edges and queues zero-indegree nodes. Here each pair is (prerequisite, dependent), nodes are unique, and every edge endpoint belongs to nodes. Duplicate edges are counted and removed consistently. A cycle leaves nodes unprocessed. Many valid orders may exist; assert dependency order rather than one arbitrary sequence. Time and space are O(V + E).",
          "The reference below is deliberately compact. Read it as a helper inside a larger codebase: check its callers and assumptions before reusing it. Explain the state after each iteration or recursive call."
        ],
        "code": "from collections import deque\n\ndef order_tasks(nodes, edges):\n    following = {n: [] for n in nodes}\n    indegree = {n: 0 for n in nodes}\n    for before, after in edges:\n        following[before].append(after)\n        indegree[after] += 1\n    ready = deque(n for n in nodes if indegree[n] == 0)\n    result = []\n    while ready:\n        node = ready.popleft()\n        result.append(node)\n        for nxt in following[node]:\n            indegree[nxt] -= 1\n            if indegree[nxt] == 0:\n                ready.append(nxt)\n    if len(result) != len(nodes):\n        raise ValueError(\"dependency cycle\")\n    return result",
        "lines": [
          "Trace one input through each state change.",
          "Identify the termination condition and the returned value."
        ],
        "prompt": "Trace this reference with a tiny input. Show intermediate state, explain complexity, and identify an assumption that its caller must enforce.",
        "question": "What signals a dependency cycle in Kahn’s algorithm?",
        "options": [
          "Every task must have exactly one prerequisite.",
          "Fewer nodes are processed than exist."
        ],
        "correct": 1,
        "feedback": "Fewer nodes are processed than exist.",
        "hint": "Check the contract rather than judging the number of lines.",
        "takeaway": "Be able to explain what each state variable represents."
      },
      {
        "title": "Prove the behavior and bound the change",
        "goal": "Turn likely mistakes into targeted checks.",
        "paragraphs": [
          "Test A→B→C, independent tasks, no tasks, a self-loop, and A→B→A. For every edge, the prerequisite index must be smaller than the dependent index.",
          "In the repository, add a failing regression test at the narrowest useful boundary, patch that path, and run its caller’s tests too. Ask AI to explain why each test would fail on the suspected bug. A passing example alone does not establish all inputs."
        ],
        "prompt": "Propose focused tests for Topological sort. Include a counterexample to a tempting wrong approach, expected results, and the existing behavior that must remain stable.",
        "question": "What signals a dependency cycle in Kahn’s algorithm?",
        "options": [
          "Fewer nodes are processed than exist.",
          "Every task must have exactly one prerequisite."
        ],
        "correct": 0,
        "feedback": "Fewer nodes are processed than exist.",
        "hint": "Choose a case where the wrong approach disagrees with the contract.",
        "takeaway": "Test A→B→C, independent tasks, no tasks, a self-loop, and A→B→A. For every edge, the prerequisite index must be smaller than the dependent index."
      }
    ]
  },
  {
    "id": "backtracking",
    "title": "Backtracking",
    "subtitle": "Enumerating valid arrangements or combinations suggests choose, explore, undo.",
    "group": "Common patterns",
    "minutes": 20,
    "icon": "",
    "source": "Original refresher • Hello Interview pattern taxonomy",
    "concepts": [
      "Backtracking",
      "Stack",
      "Reference"
    ],
    "lab": "pattern",
    "steps": [
      {
        "title": "Recognize it in a repository",
        "goal": "Enumerating valid arrangements or combinations suggests choose, explore, undo.",
        "paragraphs": [
          "Enumerating valid arrangements or combinations suggests choose, explore, undo.",
          "This example enumerates size-k combinations of distinct input items. A monotonically increasing start index avoids permutations of the same combination. Copy the current path when recording it; storing the live list would let later pop operations change previous answers. Output size is combinatorial, and copying each k-item result costs O(k). Recursion depth is at most k for valid k.",
          "Start at the caller and follow one concrete input into the helper. Identify the representation, the state that changes, and the return contract. Ask AI for file and function references before requesting edits."
        ],
        "prompt": "Map the relevant callers, representation, and invariant for Backtracking. Do not edit. Explain why this pattern fits and when it would not.",
        "question": "Why copy path when recording an answer?",
        "options": [
          "Later mutations must not alter recorded solutions.",
          "Copying guarantees polynomial runtime."
        ],
        "correct": 0,
        "feedback": "Later mutations must not alter recorded solutions.",
        "hint": "Follow the information the operation must preserve.",
        "takeaway": "Choose a representation from the behavior, then verify it in the actual call path."
      },
      {
        "title": "Trace the implementation",
        "goal": "Predict intermediate state before accepting the result.",
        "paragraphs": [
          "This example enumerates size-k combinations of distinct input items. A monotonically increasing start index avoids permutations of the same combination. Copy the current path when recording it; storing the live list would let later pop operations change previous answers. Output size is combinatorial, and copying each k-item result costs O(k). Recursion depth is at most k for valid k.",
          "The reference below is deliberately compact. Read it as a helper inside a larger codebase: check its callers and assumptions before reusing it. Explain the state after each iteration or recursive call."
        ],
        "code": "def combinations(items, k):\n    if k < 0:\n        raise ValueError(\"negative size\")\n    result = []\n    path = []\n    def visit(start):\n        if len(path) == k:\n            result.append(path.copy())\n            return\n        for i in range(start, len(items)):\n            path.append(items[i])\n            visit(i + 1)\n            path.pop()\n    visit(0)\n    return result",
        "lines": [
          "Trace one input through each state change.",
          "Identify the termination condition and the returned value."
        ],
        "prompt": "Trace this reference with a tiny input. Show intermediate state, explain complexity, and identify an assumption that its caller must enforce.",
        "question": "Why copy path when recording an answer?",
        "options": [
          "Copying guarantees polynomial runtime.",
          "Later mutations must not alter recorded solutions."
        ],
        "correct": 1,
        "feedback": "Later mutations must not alter recorded solutions.",
        "hint": "Check the contract rather than judging the number of lines.",
        "takeaway": "Be able to explain what each state variable represents."
      },
      {
        "title": "Prove the behavior and bound the change",
        "goal": "Turn likely mistakes into targeted checks.",
        "paragraphs": [
          "For [A,B,C], k=2 expect AB, AC, BC. Check k=0 → [[]], k larger than input → [], negative k rejected, and that editing one returned list does not change another. Duplicate input values require an explicit deduplication policy.",
          "In the repository, add a failing regression test at the narrowest useful boundary, patch that path, and run its caller’s tests too. Ask AI to explain why each test would fail on the suspected bug. A passing example alone does not establish all inputs."
        ],
        "prompt": "Propose focused tests for Backtracking. Include a counterexample to a tempting wrong approach, expected results, and the existing behavior that must remain stable.",
        "question": "Why copy path when recording an answer?",
        "options": [
          "Later mutations must not alter recorded solutions.",
          "Copying guarantees polynomial runtime."
        ],
        "correct": 0,
        "feedback": "Later mutations must not alter recorded solutions.",
        "hint": "Choose a case where the wrong approach disagrees with the contract.",
        "takeaway": "For [A,B,C], k=2 expect AB, AC, BC. Check k=0 → [[]], k larger than input → [], negative k rejected, and that editing one returned list does not change another. Duplicate input values require an explicit deduplication policy."
      }
    ]
  },
  {
    "id": "greedy",
    "title": "Greedy & bin packing",
    "subtitle": "Repeated local choices can simplify scheduling and packing, but require a justified rule.",
    "group": "Common patterns",
    "minutes": 20,
    "icon": "",
    "source": "Original refresher • Hello Interview pattern taxonomy",
    "concepts": [
      "Greedy",
      "Heap",
      "Interval"
    ],
    "lab": "pattern",
    "steps": [
      {
        "title": "Recognize it in a repository",
        "goal": "Repeated local choices can simplify scheduling and packing, but require a justified rule.",
        "paragraphs": [
          "Repeated local choices can simplify scheduling and packing, but require a justified rule.",
          "For maximum count of nonoverlapping intervals, picking the earliest finish leaves the most room for later choices. Here intervals are valid half-open ranges with start < end. Sorting costs O(n log n). For bin packing, first-fit decreasing sorts item sizes descending and places each in the first bin with room. It is a heuristic for general bin packing, not a guarantee of minimum bin count. Distinguish exact scheduling results from packing heuristics.",
          "Start at the caller and follow one concrete input into the helper. Identify the representation, the state that changes, and the return contract. Ask AI for file and function references before requesting edits."
        ],
        "prompt": "Map the relevant callers, representation, and invariant for Greedy & bin packing. Do not edit. Explain why this pattern fits and when it would not.",
        "question": "Does every greedy rule produce an optimum?",
        "options": [
          "No; prove the rule for the objective or label it a heuristic.",
          "Yes, if each local choice looks best."
        ],
        "correct": 0,
        "feedback": "No; prove the rule for the objective or label it a heuristic.",
        "hint": "Follow the information the operation must preserve.",
        "takeaway": "Choose a representation from the behavior, then verify it in the actual call path."
      },
      {
        "title": "Trace the implementation",
        "goal": "Predict intermediate state before accepting the result.",
        "paragraphs": [
          "For maximum count of nonoverlapping intervals, picking the earliest finish leaves the most room for later choices. Here intervals are valid half-open ranges with start < end. Sorting costs O(n log n). For bin packing, first-fit decreasing sorts item sizes descending and places each in the first bin with room. It is a heuristic for general bin packing, not a guarantee of minimum bin count. Distinguish exact scheduling results from packing heuristics.",
          "The reference below is deliberately compact. Read it as a helper inside a larger codebase: check its callers and assumptions before reusing it. Explain the state after each iteration or recursive call."
        ],
        "code": "def select_meetings(intervals):\n    chosen = []\n    end = None\n    for start, finish in sorted(intervals, key=lambda x: x[1]):\n        if start >= finish:\n            raise ValueError(\"invalid interval\")\n        if end is None or start >= end:\n            chosen.append((start, finish))\n            end = finish\n    return chosen",
        "lines": [
          "Trace one input through each state change.",
          "Identify the termination condition and the returned value."
        ],
        "prompt": "Trace this reference with a tiny input. Show intermediate state, explain complexity, and identify an assumption that its caller must enforce.",
        "question": "Does every greedy rule produce an optimum?",
        "options": [
          "Yes, if each local choice looks best.",
          "No; prove the rule for the objective or label it a heuristic."
        ],
        "correct": 1,
        "feedback": "No; prove the rule for the objective or label it a heuristic.",
        "hint": "Check the contract rather than judging the number of lines.",
        "takeaway": "Be able to explain what each state variable represents."
      },
      {
        "title": "Prove the behavior and bound the change",
        "goal": "Turn likely mistakes into targeted checks.",
        "paragraphs": [
          "Compare a long meeting (0,10) with (0,2), (2,4), (4,6): earliest finish selects three. Test adjacent boundaries and empty input. To challenge an unrelated greedy claim, coin choices 1,3,4 for amount 6 defeat largest-first: 4+1+1 loses to 3+3.",
          "In the repository, add a failing regression test at the narrowest useful boundary, patch that path, and run its caller’s tests too. Ask AI to explain why each test would fail on the suspected bug. A passing example alone does not establish all inputs."
        ],
        "prompt": "Propose focused tests for Greedy & bin packing. Include a counterexample to a tempting wrong approach, expected results, and the existing behavior that must remain stable.",
        "question": "Does every greedy rule produce an optimum?",
        "options": [
          "No; prove the rule for the objective or label it a heuristic.",
          "Yes, if each local choice looks best."
        ],
        "correct": 0,
        "feedback": "No; prove the rule for the objective or label it a heuristic.",
        "hint": "Choose a case where the wrong approach disagrees with the contract.",
        "takeaway": "Compare a long meeting (0,10) with (0,2), (2,4), (4,6): earliest finish selects three. Test adjacent boundaries and empty input. To challenge an unrelated greedy claim, coin choices 1,3,4 for amount 6 defeat largest-first: 4+1+1 loses to 3+3."
      }
    ]
  },
  {
    "id": "dp",
    "title": "Dynamic programming",
    "subtitle": "Repeated subproblems and a best value over smaller states suggest dynamic programming.",
    "group": "Common patterns",
    "minutes": 20,
    "icon": "",
    "source": "Original refresher • Hello Interview pattern taxonomy",
    "concepts": [
      "Dynamic programming",
      "Memoization",
      "State"
    ],
    "lab": "pattern",
    "steps": [
      {
        "title": "Recognize it in a repository",
        "goal": "Repeated subproblems and a best value over smaller states suggest dynamic programming.",
        "paragraphs": [
          "Repeated subproblems and a best value over smaller states suggest dynamic programming.",
          "Define state before code: best[x] is the fewest coins to make amount x. Base best[0]=0. Try each positive denomination as the last coin. This is unbounded coin change: coins can be reused. Time O(amount × denominations), space O(amount). Negative amounts and nonpositive or noninteger coins are rejected. A large amount can make this table unsuitable.",
          "Start at the caller and follow one concrete input into the helper. Identify the representation, the state that changes, and the return contract. Ask AI for file and function references before requesting edits."
        ],
        "prompt": "Map the relevant callers, representation, and invariant for Dynamic programming. Do not edit. Explain why this pattern fits and when it would not.",
        "question": "What does best[x] represent here?",
        "options": [
          "The minimum number of reusable coins totaling x.",
          "The number of different coin orderings."
        ],
        "correct": 0,
        "feedback": "The minimum number of reusable coins totaling x.",
        "hint": "Follow the information the operation must preserve.",
        "takeaway": "Choose a representation from the behavior, then verify it in the actual call path."
      },
      {
        "title": "Trace the implementation",
        "goal": "Predict intermediate state before accepting the result.",
        "paragraphs": [
          "Define state before code: best[x] is the fewest coins to make amount x. Base best[0]=0. Try each positive denomination as the last coin. This is unbounded coin change: coins can be reused. Time O(amount × denominations), space O(amount). Negative amounts and nonpositive or noninteger coins are rejected. A large amount can make this table unsuitable.",
          "The reference below is deliberately compact. Read it as a helper inside a larger codebase: check its callers and assumptions before reusing it. Explain the state after each iteration or recursive call."
        ],
        "code": "def fewest_coins(coins, amount):\n    if not isinstance(amount, int) or amount < 0:\n        raise ValueError(\"invalid amount\")\n    if any(not isinstance(c, int) or c <= 0 for c in coins):\n        raise ValueError(\"invalid coin\")\n    best = [float(\"inf\")] * (amount + 1)\n    best[0] = 0\n    for x in range(1, amount + 1):\n        for coin in coins:\n            if coin <= x:\n                best[x] = min(best[x], best[x - coin] + 1)\n    return None if best[amount] == float(\"inf\") else best[amount]",
        "lines": [
          "Trace one input through each state change.",
          "Identify the termination condition and the returned value."
        ],
        "prompt": "Trace this reference with a tiny input. Show intermediate state, explain complexity, and identify an assumption that its caller must enforce.",
        "question": "What does best[x] represent here?",
        "options": [
          "The number of different coin orderings.",
          "The minimum number of reusable coins totaling x."
        ],
        "correct": 1,
        "feedback": "The minimum number of reusable coins totaling x.",
        "hint": "Check the contract rather than judging the number of lines.",
        "takeaway": "Be able to explain what each state variable represents."
      },
      {
        "title": "Prove the behavior and bound the change",
        "goal": "Turn likely mistakes into targeted checks.",
        "paragraphs": [
          "Check [1,3,4], amount 6 → 2; [2], amount 3 → None; amount 0 → 0; empty coins with positive amount → None. Ask whether each coin can be reused: a 0/1 variant needs a different recurrence or iteration discipline.",
          "In the repository, add a failing regression test at the narrowest useful boundary, patch that path, and run its caller’s tests too. Ask AI to explain why each test would fail on the suspected bug. A passing example alone does not establish all inputs."
        ],
        "prompt": "Propose focused tests for Dynamic programming. Include a counterexample to a tempting wrong approach, expected results, and the existing behavior that must remain stable.",
        "question": "What does best[x] represent here?",
        "options": [
          "The minimum number of reusable coins totaling x.",
          "The number of different coin orderings."
        ],
        "correct": 0,
        "feedback": "The minimum number of reusable coins totaling x.",
        "hint": "Choose a case where the wrong approach disagrees with the contract.",
        "takeaway": "Check [1,3,4], amount 6 → 2; [2], amount 3 → None; amount 0 → 0; empty coins with positive amount → None. Ask whether each coin can be reused: a 0/1 variant needs a different recurrence or iteration discipline."
      }
    ]
  },
  {
    "id": "parsing",
    "title": "String matching & parsing",
    "subtitle": "Text recognition needs explicit token, boundary, and normalization rules.",
    "group": "Common patterns",
    "minutes": 20,
    "icon": "",
    "source": "Original refresher • Hello Interview pattern taxonomy",
    "concepts": [
      "Parser",
      "Trie",
      "Set"
    ],
    "lab": "pattern",
    "steps": [
      {
        "title": "Recognize it in a repository",
        "goal": "Text recognition needs explicit token, boundary, and normalization rules.",
        "paragraphs": [
          "Text recognition needs explicit token, boundary, and normalization rules.",
          "Distinguish exact lookup (set), prefix lookup (trie), substring search, and parsing structured input. The helper below parses a tiny SYMBOL:quantity format. It strips outer whitespace, permits ASCII uppercase symbols, and requires a positive ASCII integer quantity. It intentionally rejects extra separators, lowercase symbols, and signs. Time and temporary space are O(n) for input length n. A nested grammar generally needs a parser or stack; splitting or regex is not a universal parser.",
          "Start at the caller and follow one concrete input into the helper. Identify the representation, the state that changes, and the return contract. Ask AI for file and function references before requesting edits."
        ],
        "prompt": "Map the relevant callers, representation, and invariant for String matching & parsing. Do not edit. Explain why this pattern fits and when it would not.",
        "question": "What should decide case normalization?",
        "options": [
          "The input contract and the layer that owns it.",
          "Always lowercase all input without asking."
        ],
        "correct": 0,
        "feedback": "The input contract and the layer that owns it.",
        "hint": "Follow the information the operation must preserve.",
        "takeaway": "Choose a representation from the behavior, then verify it in the actual call path."
      },
      {
        "title": "Trace the implementation",
        "goal": "Predict intermediate state before accepting the result.",
        "paragraphs": [
          "Distinguish exact lookup (set), prefix lookup (trie), substring search, and parsing structured input. The helper below parses a tiny SYMBOL:quantity format. It strips outer whitespace, permits ASCII uppercase symbols, and requires a positive ASCII integer quantity. It intentionally rejects extra separators, lowercase symbols, and signs. Time and temporary space are O(n) for input length n. A nested grammar generally needs a parser or stack; splitting or regex is not a universal parser.",
          "The reference below is deliberately compact. Read it as a helper inside a larger codebase: check its callers and assumptions before reusing it. Explain the state after each iteration or recursive call."
        ],
        "code": "def parse_order(text):\n    parts = text.strip().split(\":\")\n    if len(parts) != 2:\n        raise ValueError(\"expected SYMBOL:quantity\")\n    symbol, quantity = parts\n    if not symbol or any(c not in \"ABCDEFGHIJKLMNOPQRSTUVWXYZ\" for c in symbol):\n        raise ValueError(\"invalid symbol\")\n    if not quantity or any(c not in \"0123456789\" for c in quantity):\n        raise ValueError(\"invalid quantity\")\n    count = int(quantity)\n    if count <= 0:\n        raise ValueError(\"quantity must be positive\")\n    return symbol, count",
        "lines": [
          "Trace one input through each state change.",
          "Identify the termination condition and the returned value."
        ],
        "prompt": "Trace this reference with a tiny input. Show intermediate state, explain complexity, and identify an assumption that its caller must enforce.",
        "question": "What should decide case normalization?",
        "options": [
          "Always lowercase all input without asking.",
          "The input contract and the layer that owns it."
        ],
        "correct": 1,
        "feedback": "The input contract and the layer that owns it.",
        "hint": "Check the contract rather than judging the number of lines.",
        "takeaway": "Be able to explain what each state variable represents."
      },
      {
        "title": "Prove the behavior and bound the change",
        "goal": "Turn likely mistakes into targeted checks.",
        "paragraphs": [
          "ABC:12 → (ABC,12); outer spaces allowed. Reject ABC:0, ABC:-1, abc:2, ABC:2:3, blank input, and Unicode digits. Decide explicitly whether case normalization belongs in the caller or this helper.",
          "In the repository, add a failing regression test at the narrowest useful boundary, patch that path, and run its caller’s tests too. Ask AI to explain why each test would fail on the suspected bug. A passing example alone does not establish all inputs."
        ],
        "prompt": "Propose focused tests for String matching & parsing. Include a counterexample to a tempting wrong approach, expected results, and the existing behavior that must remain stable.",
        "question": "What should decide case normalization?",
        "options": [
          "The input contract and the layer that owns it.",
          "Always lowercase all input without asking."
        ],
        "correct": 0,
        "feedback": "The input contract and the layer that owns it.",
        "hint": "Choose a case where the wrong approach disagrees with the contract.",
        "takeaway": "ABC:12 → (ABC,12); outer spaces allowed. Reject ABC:0, ABC:-1, abc:2, ABC:2:3, blank input, and Unicode digits. Decide explicitly whether case normalization belongs in the caller or this helper."
      }
    ]
  },
  {
    "id": "structure-design",
    "title": "Data structure design",
    "subtitle": "Start with operations and invariants, then combine structures to support them.",
    "group": "Common patterns",
    "minutes": 20,
    "icon": "",
    "source": "Original refresher • Hello Interview pattern taxonomy",
    "concepts": [
      "LRU",
      "Dictionary",
      "Linked list"
    ],
    "lab": "pattern",
    "steps": [
      {
        "title": "Recognize it in a repository",
        "goal": "Start with operations and invariants, then combine structures to support them.",
        "paragraphs": [
          "Start with operations and invariants, then combine structures to support them.",
          "A lookup table answers which object; a linked list answers its neighbors and order. Combining a dictionary with a doubly linked list supports average O(1) LRU get/put with explicit pointer updates. Python OrderedDict offers the same useful ordered-map abstraction. A heap supports priority, but cannot efficiently answer arbitrary membership alone. Track update, deletion, duplicate, and capacity rules as part of the public contract.",
          "Start at the caller and follow one concrete input into the helper. Identify the representation, the state that changes, and the return contract. Ask AI for file and function references before requesting edits."
        ],
        "prompt": "Map the relevant callers, representation, and invariant for Data structure design. Do not edit. Explain why this pattern fits and when it would not.",
        "question": "What makes the ordered-map LRU efficient?",
        "options": [
          "Lookup and recency updates both avoid scanning all items.",
          "Sorting the full cache on every get."
        ],
        "correct": 0,
        "feedback": "Lookup and recency updates both avoid scanning all items.",
        "hint": "Follow the information the operation must preserve.",
        "takeaway": "Choose a representation from the behavior, then verify it in the actual call path."
      },
      {
        "title": "Trace the implementation",
        "goal": "Predict intermediate state before accepting the result.",
        "paragraphs": [
          "A lookup table answers which object; a linked list answers its neighbors and order. Combining a dictionary with a doubly linked list supports average O(1) LRU get/put with explicit pointer updates. Python OrderedDict offers the same useful ordered-map abstraction. A heap supports priority, but cannot efficiently answer arbitrary membership alone. Track update, deletion, duplicate, and capacity rules as part of the public contract.",
          "The reference below is deliberately compact. Read it as a helper inside a larger codebase: check its callers and assumptions before reusing it. Explain the state after each iteration or recursive call."
        ],
        "code": "from collections import OrderedDict\n\nclass LRU:\n    def __init__(self, capacity):\n        if capacity <= 0:\n            raise ValueError(\"positive capacity required\")\n        self.capacity = capacity\n        self.data = OrderedDict()\n    def get(self, key):\n        value = self.data[key]  # a miss raises KeyError\n        self.data.move_to_end(key)\n        return value\n    def put(self, key, value):\n        self.data[key] = value\n        self.data.move_to_end(key)\n        if len(self.data) > self.capacity:\n            self.data.popitem(last=False)",
        "lines": [
          "Trace one input through each state change.",
          "Identify the termination condition and the returned value."
        ],
        "prompt": "Trace this reference with a tiny input. Show intermediate state, explain complexity, and identify an assumption that its caller must enforce.",
        "question": "What makes the ordered-map LRU efficient?",
        "options": [
          "Sorting the full cache on every get.",
          "Lookup and recency updates both avoid scanning all items."
        ],
        "correct": 1,
        "feedback": "Lookup and recency updates both avoid scanning all items.",
        "hint": "Check the contract rather than judging the number of lines.",
        "takeaway": "Be able to explain what each state variable represents."
      },
      {
        "title": "Prove the behavior and bound the change",
        "goal": "Turn likely mistakes into targeted checks.",
        "paragraphs": [
          "Capacity 2: put A, put B, get A, put C must evict B. Updating A at capacity must not evict another key. A miss raises KeyError and changes nothing. Reject capacity 0. Contrast this average O(1) ordered-map design with the existing scan-based LRU/LFU teaching experiment.",
          "In the repository, add a failing regression test at the narrowest useful boundary, patch that path, and run its caller’s tests too. Ask AI to explain why each test would fail on the suspected bug. A passing example alone does not establish all inputs."
        ],
        "prompt": "Propose focused tests for Data structure design. Include a counterexample to a tempting wrong approach, expected results, and the existing behavior that must remain stable.",
        "question": "What makes the ordered-map LRU efficient?",
        "options": [
          "Lookup and recency updates both avoid scanning all items.",
          "Sorting the full cache on every get."
        ],
        "correct": 0,
        "feedback": "Lookup and recency updates both avoid scanning all items.",
        "hint": "Choose a case where the wrong approach disagrees with the contract.",
        "takeaway": "Capacity 2: put A, put B, get A, put C must evict B. Updating A at capacity must not evict another key. A miss raises KeyError and changes nothing. Reject capacity 0. Contrast this average O(1) ordered-map design with the existing scan-based LRU/LFU teaching experiment."
      }
    ]
  },
  {
    "id": "tries",
    "title": "Tries: prefixes and exact words",
    "subtitle": "Autocomplete and shared prefixes are a trie-shaped problem.",
    "group": "Data structures",
    "minutes": 20,
    "icon": "",
    "source": "Original refresher • Python data-structure practice",
    "concepts": [
      "Trie",
      "Dictionary",
      "Prefix"
    ],
    "lab": "pattern",
    "steps": [
      {
        "title": "Recognize it in a repository",
        "goal": "Autocomplete and shared prefixes are a trie-shaped problem.",
        "paragraphs": [
          "Autocomplete and shared prefixes are a trie-shaped problem.",
          "A trie stores one character per edge and shares prefixes. A terminal flag distinguishes a complete word from a path prefix: inserting car does not make ca a stored word. The nested dictionary below uses None as a terminal marker, safely separate from string characters. Insert and lookup take expected O(L) for word length L with dictionary children; storage scales with distinct prefix nodes. A set is simpler for exact membership alone.",
          "Start at the caller and follow one concrete input into the helper. Identify the representation, the state that changes, and the return contract. Ask AI for file and function references before requesting edits."
        ],
        "prompt": "Map the relevant callers, representation, and invariant for Tries: prefixes and exact words. Do not edit. Explain why this pattern fits and when it would not.",
        "question": "Does an existing prefix necessarily mean an exact stored word?",
        "options": [
          "No; check the terminal marker.",
          "Yes, every prefix is automatically a word."
        ],
        "correct": 0,
        "feedback": "No; check the terminal marker.",
        "hint": "Follow the information the operation must preserve.",
        "takeaway": "Choose a representation from the behavior, then verify it in the actual call path."
      },
      {
        "title": "Trace the implementation",
        "goal": "Predict intermediate state before accepting the result.",
        "paragraphs": [
          "A trie stores one character per edge and shares prefixes. A terminal flag distinguishes a complete word from a path prefix: inserting car does not make ca a stored word. The nested dictionary below uses None as a terminal marker, safely separate from string characters. Insert and lookup take expected O(L) for word length L with dictionary children; storage scales with distinct prefix nodes. A set is simpler for exact membership alone.",
          "The reference below is deliberately compact. Read it as a helper inside a larger codebase: check its callers and assumptions before reusing it. Explain the state after each iteration or recursive call."
        ],
        "code": "class Trie:\n    def __init__(self):\n        self.root = {}\n    def insert(self, word):\n        node = self.root\n        for char in word:\n            node = node.setdefault(char, {})\n        node[None] = True\n    def contains(self, word):\n        node = self.root\n        for char in word:\n            if char not in node:\n                return False\n            node = node[char]\n        return None in node\n    def has_prefix(self, prefix):\n        node = self.root\n        for char in prefix:\n            if char not in node:\n                return False\n            node = node[char]\n        return True",
        "lines": [
          "Trace one input through each state change.",
          "Identify the termination condition and the returned value."
        ],
        "prompt": "Trace this reference with a tiny input. Show intermediate state, explain complexity, and identify an assumption that its caller must enforce.",
        "question": "Does an existing prefix necessarily mean an exact stored word?",
        "options": [
          "Yes, every prefix is automatically a word.",
          "No; check the terminal marker."
        ],
        "correct": 1,
        "feedback": "No; check the terminal marker.",
        "hint": "Check the contract rather than judging the number of lines.",
        "takeaway": "Be able to explain what each state variable represents."
      },
      {
        "title": "Prove the behavior and bound the change",
        "goal": "Turn likely mistakes into targeted checks.",
        "paragraphs": [
          "Insert car and cart. contains(ca) is False; has_prefix(ca) is True. Duplicate insertion is harmless. Empty prefix is True; empty word is stored only if explicitly inserted. Case-sensitive here; choose normalization before building a spell checker. Prefix existence is O(L); enumerating completions also costs traversal and output size.",
          "In the repository, add a failing regression test at the narrowest useful boundary, patch that path, and run its caller’s tests too. Ask AI to explain why each test would fail on the suspected bug. A passing example alone does not establish all inputs."
        ],
        "prompt": "Propose focused tests for Tries: prefixes and exact words. Include a counterexample to a tempting wrong approach, expected results, and the existing behavior that must remain stable.",
        "question": "Does an existing prefix necessarily mean an exact stored word?",
        "options": [
          "No; check the terminal marker.",
          "Yes, every prefix is automatically a word."
        ],
        "correct": 0,
        "feedback": "No; check the terminal marker.",
        "hint": "Choose a case where the wrong approach disagrees with the contract.",
        "takeaway": "Insert car and cart. contains(ca) is False; has_prefix(ca) is True. Duplicate insertion is harmless. Empty prefix is True; empty word is stored only if explicitly inserted. Case-sensitive here; choose normalization before building a spell checker. Prefix existence is O(L); enumerating completions also costs traversal and output size."
      }
    ]
  },
  {
    "id": "collections",
    "title": "Choose the right Python collection",
    "subtitle": "Match operations to dict, set, deque, stack, heap, or sorted list.",
    "group": "Data structures",
    "minutes": 20,
    "icon": "",
    "source": "Original refresher • Python data-structure practice",
    "concepts": [
      "Queue",
      "Heap",
      "Stack"
    ],
    "lab": "pattern",
    "steps": [
      {
        "title": "Recognize it in a repository",
        "goal": "Match operations to dict, set, deque, stack, heap, or sorted list.",
        "paragraphs": [
          "Match operations to dict, set, deque, stack, heap, or sorted list.",
          "Use dict for expected O(1) key lookup, set for expected O(1) membership and deduplication, deque for O(1) endpoint queue operations, list append/pop for an amortized O(1) stack, and heapq for O(log n) priority insertion/removal. A sorted list offers O(log n) bisect search but O(n) insertion shifts. Hash performance is average-case; representation and key hashing costs still matter. Trace which operations dominate the actual workload.",
          "Start at the caller and follow one concrete input into the helper. Identify the representation, the state that changes, and the return contract. Ask AI for file and function references before requesting edits."
        ],
        "prompt": "Map the relevant callers, representation, and invariant for Choose the right Python collection. Do not edit. Explain why this pattern fits and when it would not.",
        "question": "Which Python structure fits a FIFO work queue?",
        "options": [
          "collections.deque with append and popleft.",
          "A list using pop(0) for constant-time removal."
        ],
        "correct": 0,
        "feedback": "collections.deque with append and popleft.",
        "hint": "Follow the information the operation must preserve.",
        "takeaway": "Choose a representation from the behavior, then verify it in the actual call path."
      },
      {
        "title": "Trace the implementation",
        "goal": "Predict intermediate state before accepting the result.",
        "paragraphs": [
          "Use dict for expected O(1) key lookup, set for expected O(1) membership and deduplication, deque for O(1) endpoint queue operations, list append/pop for an amortized O(1) stack, and heapq for O(log n) priority insertion/removal. A sorted list offers O(log n) bisect search but O(n) insertion shifts. Hash performance is average-case; representation and key hashing costs still matter. Trace which operations dominate the actual workload.",
          "The reference below is deliberately compact. Read it as a helper inside a larger codebase: check its callers and assumptions before reusing it. Explain the state after each iteration or recursive call."
        ],
        "code": "from collections import deque, Counter\nimport heapq\n\nqueue = deque([\"A\", \"B\"])\nassert queue.popleft() == \"A\"\nstack = [\"A\", \"B\"]\nassert stack.pop() == \"B\"\ncounts = Counter([\"A\", \"A\", \"B\"])\nassert counts[\"A\"] == 2\nheap = []\nheapq.heappush(heap, (2, \"later\"))\nheapq.heappush(heap, (1, \"next\"))\nassert heapq.heappop(heap) == (1, \"next\")",
        "lines": [
          "Trace one input through each state change.",
          "Identify the termination condition and the returned value."
        ],
        "prompt": "Trace this reference with a tiny input. Show intermediate state, explain complexity, and identify an assumption that its caller must enforce.",
        "question": "Which Python structure fits a FIFO work queue?",
        "options": [
          "A list using pop(0) for constant-time removal.",
          "collections.deque with append and popleft."
        ],
        "correct": 1,
        "feedback": "collections.deque with append and popleft.",
        "hint": "Check the contract rather than judging the number of lines.",
        "takeaway": "Be able to explain what each state variable represents."
      },
      {
        "title": "Prove the behavior and bound the change",
        "goal": "Turn likely mistakes into targeted checks.",
        "paragraphs": [
          "Test equal-priority heap items and specify a tie rule: (priority, sequence_number, task) avoids comparing nonorderable task objects. Test duplicate counting versus mere membership. Check that using list.pop(0) in a large BFS introduces O(n) shifts per removal; deque avoids this.",
          "In the repository, add a failing regression test at the narrowest useful boundary, patch that path, and run its caller’s tests too. Ask AI to explain why each test would fail on the suspected bug. A passing example alone does not establish all inputs."
        ],
        "prompt": "Propose focused tests for Choose the right Python collection. Include a counterexample to a tempting wrong approach, expected results, and the existing behavior that must remain stable.",
        "question": "Which Python structure fits a FIFO work queue?",
        "options": [
          "collections.deque with append and popleft.",
          "A list using pop(0) for constant-time removal."
        ],
        "correct": 0,
        "feedback": "collections.deque with append and popleft.",
        "hint": "Choose a case where the wrong approach disagrees with the contract.",
        "takeaway": "Test equal-priority heap items and specify a tie rule: (priority, sequence_number, task) avoids comparing nonorderable task objects. Test duplicate counting versus mere membership. Check that using list.pop(0) in a large BFS introduces O(n) shifts per removal; deque avoids this."
      }
    ]
  }
];
