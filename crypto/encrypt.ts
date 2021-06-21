import { getUint8ArrayFromFile, importPassphrase } from './utils';

export const encryptFile = async (file: File, passphrase: string): Promise<Uint8Array | null> => {
  try {
    const plainTextBytesUnitArray = await getUint8ArrayFromFile(file);
    if (!plainTextBytesUnitArray) {
      throw new Error('Reading the file failed');
    }

    const passphraseKey = await importPassphrase(passphrase);
    if (!passphraseKey) {
      throw new Error('Passphrasekey import failed');
    }

    console.log('passphrasekey imported');

    const pbkdf2salt = window.crypto.getRandomValues(new Uint8Array(8));

    let pbkdf2bytes = await window.crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: pbkdf2salt, iterations: 10000, hash: 'SHA-256' },
      passphraseKey,
      384
    );

    console.log('pbkdf2bytes derived');
    pbkdf2bytes = new Uint8Array(pbkdf2bytes);

    const keyBytes = pbkdf2bytes.slice(0, 32);
    const ivBytes = pbkdf2bytes.slice(32);

    const key = await window.crypto.subtle.importKey('raw', keyBytes, { name: 'AES-CBC', length: 256 }, false, [
      'encrypt',
    ]);

    console.log('key imported');

    let cipherBytes = await window.crypto.subtle.encrypt(
      { name: 'AES-CBC', iv: ivBytes },
      key,
      plainTextBytesUnitArray
    );

    if (!cipherBytes) {
      throw new Error('Error encrypting file. ');
    }

    console.log('plaintext encrypted');
    const cipherBytesUnitArray = new Uint8Array(cipherBytes);

    const resultBytes = new Uint8Array(cipherBytesUnitArray.length + 16);
    resultBytes.set(new TextEncoder().encode('Salted__'));
    resultBytes.set(pbkdf2salt, 8);
    resultBytes.set(cipherBytesUnitArray, 16);

    return resultBytes;
  } catch (error) {
    return null;
  }
};
