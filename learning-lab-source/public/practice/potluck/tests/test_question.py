"""Starter tests. Some of these may fail on the starter code."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest

from question import (
    DrawClosedError,
    FundraiserPool,
    InvalidCodeError,
    calculate_payouts,
)


def test_pot_includes_sponsor_seed_and_entry_fees():
    pool = FundraiserPool()
    for name in ["Mina", "Omar", "Priya"]:
        pool.enter(name, code="11111")
    draw = pool.close_draw(winning_code="22222")
    assert draw.pot_cents == 1_000_000 + 3 * 500


def test_supplied_code_must_be_five_digits():
    pool = FundraiserPool()
    with pytest.raises(InvalidCodeError):
        pool.enter("Mina", code="1234")


def test_draw_cannot_be_closed_twice():
    pool = FundraiserPool()
    pool.enter("Mina", code="11111")
    pool.close_draw(winning_code="11111")
    with pytest.raises(DrawClosedError):
        pool.close_draw(winning_code="11111")


def test_single_five_match_takes_whole_pot():
    pool = FundraiserPool()
    pool.enter("Mina", code="12345")
    pool.enter("Omar", code="12340")
    draw = pool.close_draw(winning_code="12345")
    plan = calculate_payouts(draw)
    assert [(p.participant, p.amount_cents) for p in plan.payouts] == [("Mina", draw.pot_cents)]
    assert plan.rollover_cents == 0


def test_generated_code_preserves_leading_zeros():
    pool = FundraiserPool(random_source=lambda: 0)
    assert pool.enter("Mina").code == "00000"
