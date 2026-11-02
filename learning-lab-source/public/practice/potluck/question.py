"""Pot Luck fundraiser drawing.

See spec.md for the product rules. All money is stored in integer cents.
"""

from __future__ import annotations

import random
from dataclasses import dataclass
from typing import Callable

SPONSOR_SEED_CENTS = 1_000_000
ENTRY_FEE_CENTS = 500
CODE_LENGTH = 5

# Share of the pot, in percent, keyed by match count.
TIER_PERCENT = {5: 100, 4: 40, 3: 20, 2: 5}


class DrawClosedError(Exception):
    """Raised when an operation is not allowed because the draw has closed."""


class InvalidCodeError(ValueError):
    """Raised when a code is not a valid five-digit code."""


@dataclass
class Entry:
    id: int
    participant: str
    code: str


@dataclass
class Draw:
    winning_code: str
    pot_cents: int
    entries: list[Entry]


@dataclass
class Payout:
    entry_id: int
    participant: str
    match_count: int
    amount_cents: int


@dataclass
class PayoutPlan:
    payouts: list[Payout]
    awarded_cents: int
    rollover_cents: int


def validate_code(code: str) -> None:
    if len(code) != CODE_LENGTH or not code.isdigit():
        raise InvalidCodeError(f"invalid code: {code!r}")


def count_matches(entry_code: str, winning_code: str) -> int:
    """Number of digits of the entry code that match the winning code."""
    return sum(1 for digit in entry_code if digit in winning_code)


class FundraiserPool:
    def __init__(self, random_source: Callable[[], float] = random.random) -> None:
        # random_source returns a float in [0.0, 1.0), like random.random.
        self._random = random_source
        self.entries: list[Entry] = []
        self.draw: Draw | None = None
        self._next_id = 1

    def _generate_code(self) -> str:
        number = int(self._random() * 99999)
        return str(number)

    def enter(self, participant: str, code: str | None = None) -> Entry:
        """Add an entry. A code may be supplied (e.g. by tests); otherwise one is generated."""
        if code is None:
            code = self._generate_code()
        else:
            validate_code(code)
        entry = Entry(id=self._next_id, participant=participant, code=code)
        self._next_id += 1
        self.entries.append(entry)
        return entry

    def close_draw(self, winning_code: str | None = None) -> Draw:
        """Close the pool and record the drawing."""
        if self.draw is not None:
            raise DrawClosedError("draw already closed")
        if winning_code is None:
            winning_code = self._generate_code()
        else:
            validate_code(winning_code)
        pot_cents = SPONSOR_SEED_CENTS + ENTRY_FEE_CENTS * len(self.entries)
        self.draw = Draw(winning_code=winning_code, pot_cents=pot_cents, entries=self.entries)
        return self.draw


def calculate_payouts(draw: Draw) -> PayoutPlan:
    pot = draw.pot_cents

    by_matches: dict[int, list[Entry]] = {}
    for entry in draw.entries:
        matches = count_matches(entry.code, draw.winning_code)
        by_matches.setdefault(matches, []).append(entry)

    # Reverse order: a 5-match winner consumes the whole pot.
    tiers = [5] if by_matches.get(5) else [4, 3, 2]

    payouts: list[Payout] = []
    for matches in tiers:
        winners = by_matches.get(matches, [])
        if not winners:
            continue
        share = round(pot * TIER_PERCENT[matches] / 100 / len(winners))
        for entry in winners:
            payouts.append(Payout(entry.id, entry.participant, matches, share))

    awarded = sum(p.amount_cents for p in payouts)
    return PayoutPlan(payouts=payouts, awarded_cents=awarded, rollover_cents=pot - awarded)


if __name__ == "__main__":
    pool = FundraiserPool(random_source=random.Random(7).random)
    for name in ["Mina", "Omar", "Priya", "Jon", "Kai"]:
        pool.enter(name)
    draw = pool.close_draw()
    plan = calculate_payouts(draw)
    print(f"winning code: {draw.winning_code}  pot: {draw.pot_cents}c")
    for e in draw.entries:
        print(f"  entry {e.id} {e.participant:<6} code={e.code}")
    for p in plan.payouts:
        print(f"  payout entry {p.entry_id} matches={p.match_count} amount={p.amount_cents}c")
    print(f"awarded={plan.awarded_cents}c rollover={plan.rollover_cents}c")
