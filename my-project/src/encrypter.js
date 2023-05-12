import { Base64 } from 'js-base64';
let seedrandom = require('seedrandom');
let index = 0;

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function explode(event) {
    console.log("Exploding char");
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '🤍';
        heart.style.animationDelay = `${getRandom(0, 3)}s`;
        heart.style.animationDuration = `${getRandom(3, 6)}s`;

        heart.style.position = 'absolute';
        let variance = 500;
        heart.style.left = event.clientX + getRandom(-variance, variance) + 'px';
        heart.style.top = event.clientY + getRandom(-variance, variance) + 'px';
        heart.style.zIndex = 9999;
        heart.hasPointerCapture = false;

        // if heart is outside the screen from left or right
        document.body.appendChild(heart);
        if (heart.style.left < 0 || heart.getBoundingClientRect().right > window.screen.width) {
            heart.remove();
        }

        setInterval(() => {
            // if heart is out of screen, remove it
            if (heart.getBoundingClientRect().top < 0) {
                heart.remove();
            }
        }, 1000);
    }
}

function shuffle(array, seed) {
    let myrng = new seedrandom(seed);

    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(myrng() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

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

let input, textarea1, textarea2, lastInput;
function startEncrpyer() {

    // get by id short-input
    input = document.getElementById('short-input');
    // textarea1
    textarea1 = document.getElementById('textarea1');
    // textarea2
    textarea2 = document.getElementById('textarea2');
    // last input
    lastInput = 1;


    function getKey() {
        // get key from input
        const key = input.value;
        // split key by '-'
        const keyParts = key.split('-');
        // get first part of key
        const key1 = keyParts[0];
        // get second part of key
        const key2 = keyParts[1];

        let key3 = "default";
        if (keyParts.length >= 3) {
            key3 = keyParts[2];
        }

        // return key1 and key2 and key3
        return {
            key1,
            key2,
            key3
        };
    }

    function getInfo() {
        // get key
        let key = getKey(),
            key1 = key.key1,
            key2 = key.key2,
            key3 = key.key3;

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
        chars = shuffle(chars, key3);
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
        // convert encrypted to base64
        encrypted = Base64.encode(encrypted);
        return encrypted;
    }

    function decrypt(text) {
        text = Base64.decode(text);
        let decrypted = "";
        let info = getInfo();
        const chars = info.chars;
        const key = info.key;

        for (let i = 0; i < text.length; i++) {
            const charIndex = chars.indexOf(text[i]);
            if (charIndex === -1) {
                decrypted += text[i];
            } else {
                let ind = ((charIndex - key) % chars.length);
                if (ind < 0) { ind += chars.length; }
                decrypted += chars[ind];
            }
        }
        return decrypted;
    }

    // textarea1 on input
    textarea1.oninput = function () {
        textarea2.value = decrypt(textarea1.value);
        // if value contains a strign
        if (textarea2.value.toLowerCase().includes("special")) {
            fetch(`https://gptapi5400.azurewebsites.net/Special/Get?text=${textarea2.value}&key=${input.value}}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    const specialModalBtn = document.getElementById('specialModalBtn');
                    specialModalBtn.click();
                    const specialModal = document.getElementById('specialModal');
                    const modalNext = document.getElementById('modalNext');
                    const modalPrev = document.getElementById('modalPrev');

                    specialModal.innerHTML = data.data[index].text;
                    modalNext.onclick = function () {
                        console.log(data.data);
                        if (index < data.data.length - 1) {
                            index++;
                        }
                        specialModal.innerHTML = data.data[index].text;
                        if (index == 4) {
                            document.addEventListener("click", explode);
                        }
                        if (index == 6) {
                            document.removeEventListener("click", explode);
                        }
                        if (index == 18) {
                            document.addEventListener("click", explode);
                        }
                    }
                    modalPrev.onclick = function () {
                        if (index > 0) {
                            index--;
                        }
                        specialModal.innerHTML = data.data[index].text;
                        if (index == 6) {
                            document.addEventListener("click", explode);
                        }
                        if (index == 17) {
                            document.removeEventListener("click", explode);
                        }
                    }
                });
        }
        lastInput = 1;
    }

    // textarea2 on input
    textarea2.oninput = function () {
        textarea1.value = encrypt(textarea2.value);
        lastInput = 2;
    }

    input.oninput = function () {
        if (lastInput === 1) {
            textarea2.value = decrypt(textarea1.value);
        }
        else {
            textarea1.value = encrypt(textarea2.value);
        }
        localStorage.setItem('key', input.value);
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

    function setRandomKey() {
        // generate word that contains 4 letters, each are distinct, each letter can only be from A,E,R,P
        let randomKey = [...Array(20)].map(() => 'AERPJ'[Math.floor(Math.random() * 5)]).join('');
        // make sure randomKey is distinct
        randomKey = [...new Set(randomKey)].join('');
        // make sure randomKey has at least one 'A' and one 'E'
        if (!randomKey.includes('A') || !randomKey.includes('E')) {
            return setRandomKey();
        }
        // add a number of 4 digits to the end of the randomKey after a '-'
        randomKey += '-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        // get a random word of 8 letters and or numbers
        const randomKey2 = [...Array(8)].map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]).join('');
        // add randomKey2 to randomKey after a '-'
        randomKey += '-' + randomKey2;
        // set random key to input
        input.value = randomKey;

        if (lastInput === 1) {
            textarea2.value = decrypt(textarea1.value);
        } else {
            textarea1.value = encrypt(textarea2.value);
        }

        localStorage.setItem('key', input.value);
    }
    // check if there is a value for the key in local storage
    if (localStorage.getItem('key')) {
        // set the value of the key in local storage to input
        input.value = localStorage.getItem('key');
    }
    else {
        // set random key
        setRandomKey();
    }
}

export { startEncrpyer };