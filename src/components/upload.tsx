import React, { useRef } from "react";

const pdfAccept = [
  ".pdf",
  "application/pdf",
  "application/x-pdf",
  "application/vnd.pdf",
  "text/pdf",
  "text/x-pdf",
].join(",");

type UploadProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Upload = ({ onChange }: UploadProps) => {
  const originalFileInput = useRef<HTMLInputElement | null>(null);

  const onClickOpenFilePicker = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (!originalFileInput.current) {
      throw new Error(`OriginalFileInput ref is null. Pass the ref to input[type="file"] element`);
    }

    originalFileInput.current.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={originalFileInput}
        multiple
        accept={pdfAccept}
        className="hidden"
        onChange={onChange}
      />
      <button
        className="bg-blue-600 text-white text-base py-2 px-3 rounded-md hover:bg-blue-800"
        onClick={onClickOpenFilePicker}
      >
        Upload
      </button>
    </div>
  );
};
