import React from "react";
import { Upload } from "./components/files/upload";
import { pdfjs } from "react-pdf";
import { PdfFiles } from "./components/pdf/pdfFiles";
import { NavBar } from "./components/navBar";

// Windicss generated css file
import "virtual:windi.css";

// CSS for react-spinner
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

// react-pdf requires this to work properly
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const App = () => {
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
            <Upload />
          </div>
        </section>
      </div>
      <PdfFiles />
    </div>
  );
};
