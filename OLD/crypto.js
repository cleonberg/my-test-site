// Simple AES-like crypto abstraction using Web Crypto (for modern browsers)

window.CryptoUtil = (function () {
  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();

  async function deriveKey(password) {
    const salt = textEncoder.encode("options-dashboard-salt");
    const baseKey = await crypto.subtle.importKey(
      "raw",
      textEncoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );

    return key;
  }

  async function encryptJson(obj, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = textEncoder.encode(JSON.stringify(obj));
    const cipher = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );
    return {
      iv: Array.from(iv),
      cipher: Array.from(new Uint8Array(cipher))
    };
  }

  async function decryptJson(payload, key) {
    const iv = new Uint8Array(payload.iv);
    const cipher = new Uint8Array(payload.cipher);
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      cipher
    );
    return JSON.parse(textDecoder.decode(plain));
  }

  return {
    deriveKey,
    encryptJson,
    decryptJson
  };
})();
