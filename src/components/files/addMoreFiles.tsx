import React, { useRef } from "react";
import { ReactComponent as AddFiles } from "../../svg/addFiles.svg";
import { pdfAccept } from "./upload";

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
      <input
        type="file"
        className="hidden"
        accept={pdfAccept}
        ref={fileOpenerRef}
        onChange={onChange}
        multiple
      />
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
