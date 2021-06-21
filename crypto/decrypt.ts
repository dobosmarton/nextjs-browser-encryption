import { getUint8ArrayFromFile, importPassphrase } from './utils';

export const decryptFile = async (file: File, passphrase: string): Promise<Uint8Array | null> => {
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

    const pbkdf2salt = plainTextBytesUnitArray.slice(8, 16);

    let pbkdf2bytes = await window.crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: pbkdf2salt, iterations: 10000, hash: 'SHA-256' },
      passphraseKey,
      384
    );

    console.log('pbkdf2bytes derived');
    pbkdf2bytes = new Uint8Array(pbkdf2bytes);

    const keyBytes = pbkdf2bytes.slice(0, 32);
    const ivBytes = pbkdf2bytes.slice(32);
    const cipherBytes = plainTextBytesUnitArray.slice(16);

    const key = await window.crypto.subtle.importKey('raw', keyBytes, { name: 'AES-CBC', length: 256 }, false, [
      'decrypt',
    ]);

    let plaintextBytes = await window.crypto.subtle.decrypt({ name: 'AES-CBC', iv: ivBytes }, key, cipherBytes);

    if (!plaintextBytes) {
      throw new Error('Error decrypting file.  Password may be incorrect.');
    }

    console.log('ciphertext decrypted');

    return new Uint8Array(plaintextBytes);
  } catch (error) {
    return null;
  }
};
