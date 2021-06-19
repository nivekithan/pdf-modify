import React, { useRef } from "react";
import { useAppDispatch } from "~hooks/store";
import { pushNewFiles } from "~store";
import { convertToArrayBuffer } from "~utils/convertToArrayBuffer";
import { ReactComponent as AddFiles } from "../../svg/addFiles.svg";
import { PdfInput } from "./pdfInput";

export const AddMoreFiles = () => {
  const fileOpenerRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (fileOpenerRef.current) {
      fileOpenerRef.current.click();
    }
  };

  const onChangePushFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;

    if (!files) {
      throw new Error(`Attach event listener on only input element whose type="file"`);
    }

    const fileArr = Array.from(files);

    const arrayBuffers = await Promise.all(fileArr.map(convertToArrayBuffer));
    const infos = arrayBuffers.map((buffers, i) => {
      const blob = new Blob([buffers], { type: "application/pdf" });
      return { url: URL.createObjectURL(blob), name: fileArr[i].name };
    });

    e.target.value = "";

    dispatch(
      pushNewFiles({
        pdf: infos.map((v) => ({
          name: v.name,
          indexArr: [],
          initialRotation: [],
          pages: [],
          renderArr: [],
          redoLength: 0,
          undoLength: 0,
          selectLength: 0,
          srcUrl: [],
          uniqueArr: [],
        })),
        urlArr: infos.map((v) => v.url),
      })
    );
  };
  return (
    <div className="grid place-items-center mb-20">
      <PdfInput multiple onChange={onChangePushFiles} ref={fileOpenerRef} />
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
