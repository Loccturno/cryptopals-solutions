# Integer Overflow Detector

## What it does
Checks if an arithmetic operation would cause 
overflow/underflow in uint8 or int8 — 
the same bug that affected Solidity contracts before v0.8.

## The Bug (Real World)
In old Solidity (pre-0.8):
```solidity
uint8 balance = 0;
balance -= 1; // = 255! Free tokens!
```
No error, no revert — silent wrap-around.

## How it works
- uint8: 0 to 255 (wraps with % 256)
- int8: -128 to 127
- Negative results wrap using ((result % 256) + 256) % 256
