import React, { useState } from "react";
import { usePdfFile } from "src/context/pdfFileProvider";
import { useAppDispatch } from "src/hooks/store";
import { removeFile } from "~store";
import { ShareFiles } from "../shareFiles";

export const PdfTopMenu = () => {
  const { name, index } = usePdfFile();
  const dispatch = useAppDispatch();

  const onClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    dispatch(removeFile(index));
  };

  return (
    <div className="border-2 border-b-0 border-gray-300 p-5 flex flex-wrap justify-between items-center">
      <h2 className="text-xl max-w-3/10 truncate">
        <span className="text-lg opacity-75">Filename :</span> {name || ""}
      </h2>
      <div className="flex flex-wrap gap-x-2">
        <ShareButton />
        <button
          className="bg-red-600 hover:bg-red-800 animate-hover px-3 py-2 text-white rounded-md text-sm"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ShareButton = () => {
  const [showModal, setShowModal] = useState(false);
  const { index } = usePdfFile();

  const onModalClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setShowModal(false);
  };

  const onShareShowModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      <button
        className="bg-indigo-600 hover:bg-indigo-800 animate-hover px-3 py-2 text-white rounded-md text-sm"
        onClick={onShareShowModal}
      >
        Share
      </button>
      {showModal ? <ShareFiles onClose={onModalClose} selectedFileIndex={index} /> : null}
    </>
  );
};
