const crypto = require('crypto');

const stolenHashes = [
  'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
  '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
  '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
];

const wordlist = [
  'password', '123456', 'password123',
  '111111', 'qwerty', 'abc123',
  'monkey', 'dragon', '12345',
  'iloveyou', 'sunshine', 'princess',
];

function dictionaryAttack(hashes, wordlist) {
  for (let i = 0; i < hashes.length; i++) {
    let cracked = false;

    for (let j = 0; j < wordlist.length; j++) {
      const hashed = crypto.createHash('sha256')
                           .update(wordlist[j])
                           .digest('hex');

      if (hashed === hashes[i]) {
        console.log(`[+] CRACKED: ${hashes[i].substring(0, 8)}... → ${wordlist[j]}`);
        cracked = true;
        break;
      }
    }

    if (!cracked) {
      console.log(`[-] NOT FOUND: ${hashes[i].substring(0, 8)}...`);
    }
  }
}

dictionaryAttack(stolenHashes, wordlist);