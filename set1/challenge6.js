const fs = require('fs');

// ============================================
// STEP 1: Hamming Distance
// ============================================

function hammingDistance(buf1, buf2) {
    let distance = 0;
    for (let i = 0; i < buf1.length; i++) {
        let xor = buf1[i] ^ buf2[i];
        while (xor > 0) {
            distance += xor & 1;
            xor >>= 1;
        }
    }
    return distance;
}

// ============================================
// STEP 2: Find Key Length
// ============================================

function findKeyLength(ciphertext) {
    const scores = [];

    for (let keySize = 2; keySize <= 40; keySize++) {
        const numBlocks = Math.min(4, Math.floor(ciphertext.length / keySize));
        let totalDistance = 0;
        let comparisons = 0;

        for (let i = 0; i < numBlocks - 1; i++) {
            const block1 = ciphertext.slice(i * keySize, (i + 1) * keySize);
            const block2 = ciphertext.slice((i + 1) * keySize, (i + 2) * keySize);
            totalDistance += hammingDistance(block1, block2) / keySize;
            comparisons++;
        }

        scores.push({ keySize, distance: totalDistance / comparisons });
    }

    scores.sort((a, b) => a.distance - b.distance);
    return scores[0].keySize;
}

// ============================================
// STEP 3: Score Text (frequency analysis)
// ============================================

function scoreText(buffer) {
    let score = 0;
    const frequencies = {
        'e': 12.7, 't': 9.1, 'a': 8.2, 'o': 7.5, 'i': 7.0,
        'n': 6.7, 's': 6.3, 'h': 6.1, 'r': 6.0, 'd': 4.3,
        'l': 4.0, 'u': 2.8, ' ': 13.0
    };
    for (let byte of buffer) {
        const char = String.fromCharCode(byte).toLowerCase();
        if (frequencies[char]) score += frequencies[char];
        if (byte < 32 || byte > 126) score -= 20;
    }
    return score;
}

// ============================================
// STEP 4: Break Single-Byte XOR
// ============================================

function breakSingleByteXOR(ciphertext) {
    let bestScore = -Infinity;
    let bestKey = 0;

    for (let key = 0; key < 256; key++) {
        const decrypted = Buffer.alloc(ciphertext.length);
        for (let i = 0; i < ciphertext.length; i++) {
            decrypted[i] = ciphertext[i] ^ key;
        }
        const score = scoreText(decrypted);
        if (score > bestScore) {
            bestScore = score;
            bestKey = key;
        }
    }
    return bestKey;
}

// ============================================
// STEP 5: Transpose Blocks
// ============================================

function transposeBlocks(ciphertext, keySize) {
    const blocks = Array.from({ length: keySize }, () => []);
    for (let i = 0; i < ciphertext.length; i++) {
        blocks[i % keySize].push(ciphertext[i]);
    }
    return blocks.map(block => Buffer.from(block));
}

// ============================================
// MAIN: Break the cipher!
// ============================================

const fileData = fs.readFileSync('6.txt', 'utf8').replace(/\n/g, '');
const ciphertext = Buffer.from(fileData, 'base64');

const keySize = findKeyLength(ciphertext);
const blocks = transposeBlocks(ciphertext, keySize);
const keyBytes = blocks.map(block => breakSingleByteXOR(block));
const key = Buffer.from(keyBytes);

const decrypted = Buffer.alloc(ciphertext.length);
for (let i = 0; i < ciphertext.length; i++) {
    decrypted[i] = ciphertext[i] ^ key[i % key.length];
}

console.log(`Key: "${key.toString('utf8')}"`);
console.log(`\nDecrypted:\n${decrypted.toString('utf8')}`);
 