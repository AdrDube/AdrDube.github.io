# Pot Luck — Community Fundraiser Drawing

A community fundraiser runs a pooled cash drawing. Participants buy entries; at the
end of the fundraiser a single drawing decides who is paid out of the pot.

## Pot

- A sponsor seeds the pot with **$10,000**.
- Every entry adds **$5** to the pot.
- The pot is calculated **at drawing time**.

## Entries and codes

- Each entry is assigned a random **5-digit code** from `00000` to `99999`
  (both endpoints are valid codes).
- A participant may hold more than one entry.

## The drawing

- When the drawing happens, a winning 5-digit code is generated and the pool is
  closed to new entries.
- Each entry is compared with the winning code and receives a **match count**.

## Payout tiers

| Matches | Share of pot |
|---|---|
| 5 | 100% |
| 4 | 40% |
| 3 | 20% |
| 2 | 5% |
| 1 or 0 | nothing |

- Tiers are processed in reverse order: 5 matches first, then 4, then 3, then 2.
- If one or more entries match all 5 digits, they claim 100% of the pot and the
  lower tiers receive nothing.
- A tier's share is split evenly among the entries in that tier.
- Any amount that is not awarded rolls over.

## Example

Three entries match 4 digits and one entry matches 2 digits. Each 4-match entry
receives 13.33% of the pot (40% ÷ 3) and the 2-match entry receives 5% of the pot.
The rest of the pot rolls over.
