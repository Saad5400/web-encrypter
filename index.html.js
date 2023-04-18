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
    // split key by '-'
    const keyParts = key.split('-');
    // get first part of key
    const key1 = keyParts[0];
    // get second part of key
    const key2 = keyParts[1];
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
    
    let chars = [];
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
    // return chars and key2
    return {
        "chars": chars,
        "key": parseInt(key2)
    };
}

function encrypt(text) {
    let encrypted = "";
    let info = getInfo();
    const chars = info.chars;
    const key = info.key;

    for (let i = 0; i < text.length; i++) {
      const charIndex = chars.indexOf(text[i]);
      if (charIndex === -1) {
        encrypted += text[i];
      } else {
        encrypted += chars[(charIndex + key) % chars.length];
      }
    }
    return encrypted;
}

function decrypt(text) {
    let decrypted = "";
    let info = getInfo();
    const chars = info.chars;
    const key = info.key;

    for (let i = 0; i < text.length; i++) {
        const charIndex = chars.indexOf(text[i]);
        if (charIndex === -1) {
            decrypted += text[i];
        } else {
            decrypted += chars[((charIndex - key) % chars.length) + chars.length];
        }
      }
    return decrypted;
}

// textarea1 on input
textarea1.oninput = function () {
    textarea2.value = decrypt(textarea1.value);
}

// textarea2 on input
textarea2.oninput = function () {
    textarea1.value = encrypt(textarea2.value);
}

function copyInput(id) {
    const input = document.getElementById(id);
    navigator.clipboard.writeText(input.value);
}
function pasteInput(id) {
    const input = document.getElementById(id);
    navigator.clipboard.readText().then(text => {
        input.value = text;
        textarea2.value = decrypt(textarea1.value);
    });
}