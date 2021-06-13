import React, { useState } from "react";
import { Upload } from "./components/upload";
import { pdfjs } from "react-pdf";
import { Pdf } from "./components/pdf";

// Windicss generated css file
import "virtual:windi.css";
import { convertToArrayBuffer } from "./utils/convertToArrayBuffer";
import { NavBar } from "./components/navBar";

// react-pdf requires this to work properly
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export type PdfFiles = {
  url: string;
  name: string;
};

export const App = () => {
  const [fileUrls, setFileUrls] = useState<PdfFiles[]>([]);

  const onChangeLoadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.currentTarget.files;

    if (!fileList) {
      throw new Error(
        "onChangeLoadFiles events listener should only be added to input[type='file']"
      );
    }

    const fileArr = Array.from(fileList);

    const arrayBuffers = await Promise.all(fileArr.map(convertToArrayBuffer));
    const urls = arrayBuffers.map((buffers, i) => {
      const blob = new Blob([buffers], { type: "application/pdf" });
      return { url: URL.createObjectURL(blob), name: fileArr[i].name };
    });

    setFileUrls(urls);
  };

  return (
    <div className="flex flex-col gap-y-30">
      <NavBar />
      <div className="grid place-items-center">
        <section className="flex flex-col gap-y-8 mx-15 items-center">
          <h1 className="font-bold text-8xl text-dark-300 text-center">Modify Your Pdf Offline</h1>
          <p className="text-3xl text-center">
            Install this site as PWA in your computer to modify your pdf offline. Every modification
            happens locally on your computer, no file is sent to any server.
          </p>
          <div className="mt-6">
            <Upload onChange={onChangeLoadFiles} />
          </div>
        </section>
      </div>
      <div className="flex flex-col gap-y-2">
        {fileUrls[0] ? <Pdf url={fileUrls[0].url} name={fileUrls[0].name} /> : null}
      </div>
    </div>
  );
};
