import React, { useRef, useCallback } from "react";
import { useAppDispatch } from "~hooks/store";
import { loadNewFiles } from "~store";
import { convertToArrayBuffer } from "~utils/convertToArrayBuffer";
import { PdfInput } from "./pdfInput";

export const Upload = () => {
  const originalFileInput = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

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

  const onChangeLoadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.currentTarget.files;

    if (!fileList) {
      throw new Error(
        "onChangeLoadFiles events listener should only be added to input[type='file']"
      );
    }

    const fileArr = Array.from(fileList);

    const arrayBuffers = await Promise.all(fileArr.map(convertToArrayBuffer));
    const infos = arrayBuffers.map((buffers, i) => {
      const blob = new Blob([buffers], { type: "application/pdf" });
      return { url: URL.createObjectURL(blob), name: fileArr[i].name };
    });

    e.target.value = "";

    dispatch(
      loadNewFiles({
        pdf: infos.map((v) => ({
          name: v.name,
          indexArr: [],
          initialRotation: [],
          pages: [],
          renderArr: [],
          redoLength: 0,
          selectLength: 0,
          undoLength: 0,
          srcUrl: [],
          uniqueArr: [],
          initialUniqueArr: [],
        })),
        urlArr: infos.map((v) => v.url),
      })
    );
  };

  return (
    <div>
      <PdfInput multiple onChange={onChangeLoadFiles} ref={originalFileInput} />
      <button
        className="bg-blue-600 text-white text-2xl px-10 py-5 rounded-md grid place-items-center hover:bg-blue-800 animate-hover"
        onClick={onClickOpenFilePicker}
      >
        Select PDF file
      </button>
    </div>
  );
};
