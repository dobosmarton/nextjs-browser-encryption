import { ChangeEvent, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';

type FileInputReturn = {
  inputRef: MutableRefObject<HTMLDivElement | null>;
  file: File | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Hook to handle the file input field operations.
 * With drag&drop functionality
 * @returns
 */
export const useFileInput = (): FileInputReturn => {
  const [file, setFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLDivElement | null>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const newFile = e.target.files?.[0];

    if (newFile) {
      setFile(newFile);
    }
  };

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer?.files && e.dataTransfer?.files?.length > 0) {
      const newFile = e.dataTransfer.files?.[0];
      setFile(newFile);
      e.dataTransfer.clearData();
    }
  }, []);

  useEffect(() => {
    const handleDefault = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const dropZone = inputRef.current;
    dropZone?.addEventListener('dragover', handleDefault);
    dropZone?.addEventListener('drop', handleDrop);
    dropZone?.addEventListener('dragenter', handleDefault);
    dropZone?.addEventListener('dragleave', handleDefault);

    return () => {
      dropZone?.removeEventListener('dragover', handleDefault);
      dropZone?.removeEventListener('drop', handleDrop);
      dropZone?.removeEventListener('dragenter', handleDefault);
      dropZone?.removeEventListener('dragleave', handleDefault);
    };
  }, [handleDrop]);

  return { inputRef, file, onFileChange };
};
