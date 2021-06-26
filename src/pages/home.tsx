import React from "react";
import { Upload } from "src/components/files/upload";
import { PdfFiles } from "src/components/pdf/pdfFiles";

const Home = () => {
  return (
    <>
      <div className="grid place-items-center">
        <section className="flex flex-col gap-y-8 mx-15 items-center">
          <h1 className="font-bold text-8xl text-dark-300 text-center">Edit your Pdf rapidly</h1>
          <p className="text-3xl text-center w-max-[90%]">
            Any file you upload will be edited in your browser no file is sent to any server. If
            your browser supports you can also install this site as PWA which allows you edit pdf
            offline.
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
