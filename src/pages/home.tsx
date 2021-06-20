import React from "react";
import { Upload } from "src/components/files/upload";
import { PdfFiles } from "src/components/pdf/pdfFiles";

const Home = () => {
  return (
    <>
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
    </>
  );
};

export default Home;
