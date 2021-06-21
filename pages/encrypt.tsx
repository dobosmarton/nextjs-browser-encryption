import { useState } from 'react';
import Link from 'next/link';
import { encryptFile } from '../crypto/encrypt';
import { bytesToDownloadableFile } from '../crypto/utils';
import { useFileInput } from '../hooks/useFileInput';

export default function Home() {
  const [password, setPassword] = useState<string | null>(null);
  const [_, setLoading] = useState<boolean>(false);

  const { file, inputRef, onFileChange } = useFileInput();

  const onFileEncrypt = async () => {
    try {
      if (file && password) {
        setLoading(true);
        const encryptedFile = await encryptFile(file, password);
        if (!encryptedFile) {
          throw new Error('File encryption failed!');
        }
        const url = bytesToDownloadableFile(encryptedFile);
        if (url) {
          window.open(url);
          URL.revokeObjectURL(url);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(`Something went wrong! ${(error as Error).message}`);
    }
  };

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="relative sm:py-16">
        <div aria-hidden="true" className="hidden sm:block">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50 rounded-r-3xl" />
          <svg className="absolute top-8 left-1/2 -ml-3" width={404} height={392} fill="none" viewBox="0 0 404 392">
            <defs>
              <pattern
                id="8228f071-bcee-4ec8-905a-2a059a2cc4fb"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse">
                <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width={404} height={392} fill="url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)" />
          </svg>
        </div>
        <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
          <div
            ref={inputRef}
            className="relative rounded-2xl px-6 py-10 bg-indigo-600 overflow-hidden shadow-xl sm:px-12 sm:py-20">
            <div aria-hidden="true" className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0">
              <svg
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 1463 360">
                <path
                  className="text-indigo-500 text-opacity-40"
                  fill="currentColor"
                  d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
                />
                <path
                  className="text-indigo-700 text-opacity-40"
                  fill="currentColor"
                  d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
                />
              </svg>
            </div>
            <div className="relative">
              <div className="sm:text-center">
                <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">Encrypt your file!</h2>
                <p className="mt-6 mx-auto max-w-2xl text-lg text-indigo-200">
                  Upload a file that you want to encrypt, then type a password to the input field which we can use for
                  the encryption. After these, you can click on the encrypt button to download the encrypted file.
                </p>
              </div>
              <div className="mt-12 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300  border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-100"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true">
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-100">
                    <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-white hover:text-gray-100 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-white-200">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" onChange={onFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <label htmlFor="file_password" className="sr-only">
                  Password
                </label>
                <input
                  id="file_password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="block border border-transparent rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                  placeholder="Enter your password"
                />
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={onFileEncrypt}
                  className="block rounded-md border border-transparent px-5 py-3 bg-indigo-500 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:px-10">
                  Encrypt
                </button>
              </div>
              <div className="mt-12 flex justify-center">
                <Link href="/decrypt">
                  <a className="text-base  text-white hover:text-gray-200">I want to decrypt my file</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
