import React, { useRef } from "react";
import { ReactComponent as AddFiles } from "../../svg/addFiles.svg";
import { PdfInput } from "./pdfInput";

type AddMoreFilesProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const AddMoreFiles = ({ onChange }: AddMoreFilesProps) => {
  const fileOpenerRef = useRef<HTMLInputElement | null>(null);

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (fileOpenerRef.current) {
      fileOpenerRef.current.click();
    }
  };

  return (
    <div className="grid place-items-center mb-20">
      <PdfInput multiple onChange={onChange} ref={fileOpenerRef} />
      <button
        className="rounded-md font-semibold flex flex-col items-center  hover:bg-white-hover p-5"
        onClick={onClick}
      >
        <AddFiles width="8rem" height="8rem" />
        <span className="text-gray-500 text-xl">Add more files</span>
      </button>
    </div>
  );
};
