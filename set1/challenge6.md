Challenge 6 — Break Repeating-Key XOR



The Problem

Given a ciphertext encrypted with repeating-key XOR, find the key

and decrypt the message — without knowing the key length or the key itself.

This is the most complex challenge in Set 1. It combines several

techniques that build on each other.



Why This Works

Repeating-key XOR encrypts like this:

plaintext:  B  u  r  n  i  n  g  ...

key:        I  C  E  I  C  E  I  ...

ciphertext: B^I u^C r^E n^I i^C n^E g^I ...

The key repeats — and that repetition is the vulnerability.

If you know the key length, you can isolate single-byte XOR problems

(which are trivial to brute-force with frequency analysis).

The challenge is finding the key length first.



Approach — 4 Steps



Step 1: Hamming Distance

Hamming distance = number of differing bits between two byte sequences.

XOR the bytes → count the 1-bits in the result

Example: 'A' (01000001) vs 'B' (01000010)

XOR = 00000011 → 2 bits differ → Hamming distance = 2

Key insight: two blocks encrypted with the same key will have

a lower normalized Hamming distance than two random blocks.

This is because the key XOR cancels out, leaving only the

distance between plaintext characters — which cluster around

common English letters.



Step 2: Find Key Length

For each candidate key size (2-40):



Take multiple consecutive blocks of that size

Compute normalized Hamming distance between them

Average across comparisons



The correct key size produces the lowest normalized distance.

Using 4 blocks (instead of 2) reduces noise significantly.



Step 3: Transpose Blocks

Once we have the key size, we reshape the ciphertext:

Original: \[b0, b1, b2, b3, b4, b5, b6, b7, b8, ...]  (keysize = 3)



Transposed:

&#x20; Block 0: \[b0, b3, b6, b9, ...]  ← all encrypted with key\[0]

&#x20; Block 1: \[b1, b4, b7, b10, ...] ← all encrypted with key\[1]

&#x20; Block 2: \[b2, b5, b8, b11, ...] ← all encrypted with key\[2]

Each transposed block is now a single-byte XOR problem.



Step 4: Break Each Block with Frequency Analysis

For each transposed block:



Try all 256 possible keys

Score the result using English letter frequencies

Highest score = correct key byte



English letter frequencies used:



Space: 13.0% (highest — often overlooked!)

E: 12.7%, T: 9.1%, A: 8.2%, O: 7.5%...

Penalize non-printable characters heavily (-20)



Result

Key: "Terminator X: Bring the noise"

Decrypted text: Vanilla Ice — "Play That Funky Music"

Key Insights



Normalization matters — dividing Hamming distance by key size

makes distances comparable across different key sizes

More block comparisons = less noise — using 4 blocks instead

of 2 gives more reliable key size detection

Space is the most common character — including it in frequency

scoring significantly improves accuracy

The attack is entirely statistical — no brute force of the full

key space (which would be 256^keylen — impossible for long keys)



Complexity



Key size search: O(40 × n) where n = ciphertext length

Frequency analysis: O(256 × n/keysize) per key byte

Total: O(n) — linear in ciphertext length

