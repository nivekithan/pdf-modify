import React, { useRef, useCallback } from "react";
import { PdfInput } from "./pdfInput";

type UploadProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Upload = ({ onChange }: UploadProps) => {
  const originalFileInput = useRef<HTMLInputElement | null>(null);

  const onClickOpenFilePicker = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      if (!originalFileInput.current) {
        throw new Error(
          `OriginalFileInput ref is null. Pass the ref to input[type="file"] element`
        );
      }

      originalFileInput.current.click();
    },
    []
  );

  return (
    <div>
      <PdfInput multiple onChange={onChange} ref={originalFileInput} />
      <button
        className="bg-blue-600 text-white text-2xl px-10 py-5 rounded-md grid place-items-center hover:bg-blue-800"
        onClick={onClickOpenFilePicker}
      >
        Select PDF file
      </button>
    </div>
  );
};
