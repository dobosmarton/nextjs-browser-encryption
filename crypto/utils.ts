/**
 * It receives a string key as the input and returns with a CryptoKey object for the Web Crypto API
 * @param passphrase		Secret key
 * @returns
 */
export const importPassphrase = async (passphrase: string): Promise<CryptoKey> => {
  const passphraseBytes = new TextEncoder().encode(passphrase);

  return window.crypto.subtle.importKey('raw', passphraseBytes, { name: 'PBKDF2' }, false, ['deriveBits']);
};

/**
 * Convert a file to string or ArrayBuffer based on the FileReader
 * @param file  	Input file that needs to convert
 * @returns
 */
const readFile = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsArrayBuffer(file);
  });

/**
 * This function transform a plain text bytes input to an Uint8Array
 * @param plainTextBytes
 * @returns
 */
const getUint8ArrayFromBytes = async (plainTextBytes: string | ArrayBuffer): Promise<Uint8Array | null> => {
  try {
    let plainTextBytesUnitArray;

    if (typeof plainTextBytes === 'string') {
      if (!('TextEncoder' in window)) alert('Sorry, this browser does not support TextEncoder...');
      const encoder = new TextEncoder();
      plainTextBytesUnitArray = encoder.encode(plainTextBytes);
    } else {
      plainTextBytesUnitArray = new Uint8Array(plainTextBytes);
    }

    return plainTextBytesUnitArray;
  } catch (error) {
    return null;
  }
};

/**
 * The function transform the input file to and Uint8Array
 * @param file
 * @returns
 */
export const getUint8ArrayFromFile = async (file: File): Promise<Uint8Array | null> => {
  const plainTextBytes = await readFile(file);
  if (!plainTextBytes) {
    throw new Error('Reading the file failed');
  }

  return getUint8ArrayFromBytes(plainTextBytes);
};

/**
 * Get downloadable URL for the given byte array
 * @param plaintextBytes
 * @returns
 */
export const bytesToDownloadableFile = (plaintextBytes: Uint8Array): string => {
  const blob = new Blob([plaintextBytes], { type: 'application/download' });
  const blobUrl = URL.createObjectURL(blob);

  return blobUrl;
};
