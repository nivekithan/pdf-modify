import React, { useRef } from "react";
import { usePdfFile } from "src/context/pdfFileProvider";
import { useAppDispatch } from "src/hooks/store";
import { convertToArrayBuffer } from "src/utils/convertToArrayBuffer";
import { replaceFile } from "~store";
import { ReactComponent as LoadError } from "../../svg/load-error.svg";
import { PdfInput } from "../files/pdfInput";

type PdfLoadErrorProps = {
  onRetry: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const PdfLoadError = ({ onRetry }: PdfLoadErrorProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const { index } = usePdfFile();

  const onUploadAnotherFile = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onLoadNewFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;

    if (!files) {
      throw new Error("You have to use this listener only in input element whose type is file");
    }

    const fileArr = Array.from(files);

    const buffer = await Promise.all(fileArr.map(convertToArrayBuffer));
    const [fileInfo] = buffer.map((buf) => {
      const bold = new Blob([buf], { type: "application/pdf" });
      return { url: URL.createObjectURL(bold), name: fileArr[0].name };
    });

    dispatch(
      replaceFile({
        index,
        pdfFile: {
          name: fileInfo.name,
          indexArr: [],
          initialRotation: [],
          pages: [],
          renderArr: [],
          redoLength: 0,
          undoLength: 0,
          selectLength: 0,
        },
        url: fileInfo.url,
      })
    );
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
