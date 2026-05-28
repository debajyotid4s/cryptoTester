const { mod } = require("../utils/math");
const { sanitizeAZ, charToNumAZ, numToCharAZ } = require("../utils/text");

function encrypt(text, options = {}) {
  const key = options.key || "KEY";
  const sanitizedKey = key.toUpperCase().replace(/[^A-Z]/g, "");
  const sanitized = sanitizeAZ(text);

  const rows = [];
  let resultText = "";
  let keyIndex = 0;
  let builtKeyStream = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char >= "A" && char <= "Z") {
      const keyChar = sanitizedKey[keyIndex % sanitizedKey.length];
      builtKeyStream += keyChar;
      const inputNum = charToNumAZ(char);
      const keyNum = charToNumAZ(keyChar);
      const outputNum = mod(inputNum + keyNum, 26);
      const outputChar = numToCharAZ(outputNum);

      rows.push({ char, keyChar, inputNum, keyNum, outputNum, outputChar });
      resultText += outputChar;
      keyIndex++;
    } else if (/\s/.test(char)) {
      resultText += char;
    }
  }

  const explain = {
    summary: [
      `Sanitized input: "${sanitized}"`,
      `Key: "${key}"`,
      `Key stream: "${builtKeyStream}"`,
    ],
    facts: {
      key,
      keyStream: builtKeyStream,
      length: sanitized.length,
    },
    rows,
    notes: [],
  };

  return { result: resultText, explain };
}

function decrypt(text, options = {}) {
  const key = options.key || "KEY";
  const sanitizedKey = key.toUpperCase().replace(/[^A-Z]/g, "");
  const sanitized = sanitizeAZ(text);

  const rows = [];
  let resultText = "";
  let keyIndex = 0;
  let builtKeyStream = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char >= "A" && char <= "Z") {
      const keyChar = sanitizedKey[keyIndex % sanitizedKey.length];
      builtKeyStream += keyChar;
      const inputNum = charToNumAZ(char);
      const keyNum = charToNumAZ(keyChar);
      const outputNum = mod(inputNum - keyNum, 26);
      const outputChar = numToCharAZ(outputNum);

      rows.push({ char, keyChar, inputNum, keyNum, outputNum, outputChar });
      resultText += outputChar;
      keyIndex++;
    } else if (/\s/.test(char)) {
      resultText += char;
    }
  }

  const explain = {
    summary: [
      `Sanitized input: "${sanitized}"`,
      `Key: "${key}"`,
      `Key stream: "${builtKeyStream}"`,
    ],
    facts: {
      key,
      keyStream: builtKeyStream,
      length: sanitized.length,
    },
    rows,
    notes: [],
  };

  return { result: resultText, explain };
}

module.exports = { encrypt, decrypt };
