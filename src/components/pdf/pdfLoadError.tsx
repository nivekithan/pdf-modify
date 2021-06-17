import React, { useRef } from "react";
import { ReactComponent as LoadError } from "../../svg/load-error.svg";
import { PdfInput } from "../files/pdfInput";

type PdfLoadErrorProps = {
  onRetry: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onLoadNewFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const PdfLoadError = ({ onRetry, onLoadNewFile }: PdfLoadErrorProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onUploadAnotherFile = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="flex gap-x-15 items-center mx-30">
      <div>
        <LoadError width="280px" height="280px" />
      </div>
      <div className="flex flex-col gap-y-8 ">
        <p className="text-xl text-center font-semibold">Sorry, unable to load this file</p>
        <div className="flex flex-wrap gap-2">
          <button
            className="bg-blue-600 hover:bg-blue-800 px-3 py-2 text-white rounded-md"
            onClick={onRetry}
          >
            Retry
          </button>
          <PdfInput multiple={false} onChange={onLoadNewFile} ref={inputRef} />
          <button
            className="bg-indigo-600 hover:bg-indigo-800 text-white px-3 py-2 rounded-md"
            onClick={onUploadAnotherFile}
          >
            Upload Another File
          </button>
        </div>
      </div>
    </div>
  );
};
