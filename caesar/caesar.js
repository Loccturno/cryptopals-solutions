function caesarEncrypt(text, shift) {
    let result = '';

    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let code = char.charCodeAt(0);

        if (code >= 65 && code <= 90) {
            result += String.fromCharCode(((code - 65 + shift) % 26) + 65);

        } else if (code >= 97 && code <= 122) {
            result += String.fromCharCode(((code - 97 + shift) % 26) + 97);
        
        } else {
            result += char;
        }
    }

    return result;
}

function caesarDecrypt(text, shift) {
    return caesarEncrypt(text, -shift);
}
console.log(caesarEncrypt("Hello World", 3));
console.log(caesarDecrypt("Khoor Zruog", 3));
console.log(caesarEncrypt("XYZ", 3));