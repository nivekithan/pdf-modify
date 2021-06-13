import React, { useState } from "react";
import { Upload } from "./components/upload";
import { pdfjs } from "react-pdf";
import { Pdf } from "./components/pdf";

// Windicss generated css file
import "virtual:windi.css";
import { convertToArrayBuffer } from "./utils/convertToArrayBuffer";

// react-pdf requires this to work properly
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const App = () => {
  const [fileUrls, setFileUrls] = useState<string[]>([]);

  const onChangeLoadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.currentTarget.files;

    if (!fileList) {
      throw new Error(
        "onChangeLoadFiles events listener should only be added to input[type='file']"
      );
    }

    const fileArr = Array.from(fileList);

    const arrayBuffers = await Promise.all(fileArr.map(convertToArrayBuffer));
    const urls = arrayBuffers.map((buffers) => {
      const blob = new Blob([buffers], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    });

    setFileUrls(urls);
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="flex flex-col gap-y-2">
        <Upload onChange={onChangeLoadFiles} />
        {fileUrls[0] ? <Pdf url={fileUrls[0]} /> : null}
      </div>
    </div>
  );
};
