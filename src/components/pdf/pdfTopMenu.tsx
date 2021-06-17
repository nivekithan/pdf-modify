import React from "react";

type PdfTopMenuProps = {
  title: string;
  onClose: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const PdfTopMenu = ({ title, onClose }: PdfTopMenuProps) => {
  return (
    <div className="border-2 border-b-0 border-gray-300 p-5 flex flex-wrap justify-between items-center">
      <h2 className="text-xl max-w-3/10 truncate">
        <span className="text-lg opacity-75">Filename :</span> {title}
      </h2>
      <button
        className="bg-red-600 hover:bg-red-800 px-3 py-2 text-white rounded-md text-sm"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};
