// get by id short-input
const input = document.getElementById('short-input');
// textarea1
const textarea1 = document.getElementById('textarea1');
// textarea2
const textarea2 = document.getElementById('textarea2');

function setRandomKey() {
    // generate word that contains 4 letters, each are distinct, each letter can only be from A,E,R,P
    let randomKey = [...Array(5)].map(() => 'AERPJ'[Math.floor(Math.random() * 5)]).join('');
    // make sure randomKey has at least one 'A' and one 'E'
    if (!randomKey.includes('A') || !randomKey.includes('E')) {
        return setRandomKey();
    }
    if (randomKey.includes("RAPE")) {
        return setRandomKey();
    }
    // add a number of 4 digits to the end of the randomKey after a '-'
    randomKey += '-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    // set random key to input
    input.value = randomKey;
}
setRandomKey();

// list of all ascii chars
const asciiChars = [...Array(256)].map((_, i) => String.fromCharCode(i));
// list of all Arabic chars
const arabicChars = [...Array(0x06ff - 0x0600)].map((_, i) => String.fromCharCode(i + 0x0600));
// list of all Russian chars
const russianChars = [...Array(0x04ff - 0x0400)].map((_, i) => String.fromCharCode(i + 0x0400));
// list of all Punjabi chars
const punjabiChars = [...Array(0x0a7f - 0x0a00)].map((_, i) => String.fromCharCode(i + 0x0a00));
// list of all Japanese chars
const japaneseChars = [...Array(0x30ff - 0x3040)].map((_, i) => String.fromCharCode(i + 0x3040));
// hash map
const charListMap = {
    'E': asciiChars,
    'A': arabicChars,
    'R': russianChars,
    'P': punjabiChars,
    'J': japaneseChars
};

function getKey() {
    // get key from input
    const key = input.value;
    // // if key is empty, return null
    // if (key === '') {
    //     return null;
    // }
    // split key by '-'
    const keyParts = key.split('-');
    // // if keyParts length is not 2, return null
    // if (keyParts.length !== 2) {
    //     return null;
    // }
    // get first part of key
    const key1 = keyParts[0];
    // get second part of key
    const key2 = keyParts[1];
    // // if key1 length is not 4, return null
    // if (key1.length <= 1) {
    //     return null;
    // }
    // // if none of the chars in key1 are in the map, return null
    // for (let i = 0; i < key1.length; i++) {
    //     const char = key1[i];
    //     if (!charListMap[char]) {
    //         return null;
    //     }
    // }
    // // if key2 length is not 4, return null
    // if (key2.length <= 1) {
    //     return null;
    // }
    // // if key2 is not a number, return null
    // if (isNaN(key2)) {
    //     return null;
    // }
    // return key1 and key2
    return {
        key1,
        key2
    };
}

function getInfo() {
    // get key
    const key = getKey();
    key1 = key.key1;
    key2 = key.key2;

    let chars = []
    // loop foreach char in key1
    for (let i = 0; i < key1.length; i++) {
        // get char
        const char = key1[i];
        // get char list from map
        const charList = charListMap[char];
        // add char list to chars
        chars = chars.concat(charList);
    }
    // make sure chars distinct
    chars = [...new Set(chars)];
    // while key is longer than chars length, subtract chars length from key
    while (key2.length > chars.length) {
        key2 -= chars.length;
    }
    console.log(chars);
    // return chars and key2
    return {
        chars,
        key2
    };
}

function encrypt(text) {
    let encryptedText = '';
    const info = getInfo();
    const chars = info.chars;
    const key = info.key2;
    // loop foreach char in text
    for (let i = 0; i < text.length; i++) {
        // get char
        const char = text[i];
        // get index of char in chars
        const index = chars.indexOf(char);
        // if index is -1, add char to encryptedText
        if (index === -1) {
            encryptedText += char;
            continue;
        }
        // assign index + key to encryptedTextIndex
        let encryptedTextIndex = index + key;
        // while encryptedTextIndex is bigger than chars length, subtract chars length from encryptedTextIndex
        while (encryptedTextIndex >= chars.length) {
            encryptedTextIndex -= chars.length;
        }
        // add char at encryptedTextIndex to encryptedText
        encryptedText += chars[encryptedTextIndex];
    }
    // return encryptedText
    return encryptedText;
}

function decrypt(text) {
    let decryptedText = '';
    const info = getInfo();
    const chars = info.chars;
    const key = info.key2;
    // loop foreach char in text
    for (let i = 0; i < text.length; i++) {
        // get char
        const char = text[i];
        // get index of char in chars
        const index = chars.indexOf(char);
        // if index is -1, add char to decryptedText
        if (index === -1) {
            decryptedText += char;
            continue;
        }
        // assign index - key to decryptedTextIndex
        let decryptedTextIndex = index - key;
        // while decryptedTextIndex is smaller than 0, add chars length to decryptedTextIndex
        while (decryptedTextIndex < 0) {
            decryptedTextIndex += chars.length;
        }
        // add char at decryptedTextIndex to decryptedText
        decryptedText += chars[decryptedTextIndex];
    }
    // return decryptedText
    return decryptedText;
}

// textarea1 on input
textarea1.oninput = function () {
    textarea2.value = decrypt(textarea1.value);
}

// textarea2 on input
textarea2.oninput = function () {
    textarea1.value = encrypt(textarea2.value);
}