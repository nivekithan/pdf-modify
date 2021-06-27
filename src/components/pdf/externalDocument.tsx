import React from "react";
import { Document } from "react-pdf";
import { usePdfFile } from "~context/pdfFileProvider";
import { useAppSelector } from "~hooks/store";
import Spinner from "react-loader-spinner";

type ExternalDocumentProps = {
  renderIndex: number;
  children: React.ReactNode;
};

export const ExternalDocument = ({ renderIndex, children }: ExternalDocumentProps) => {
  const { index: fileIndex } = usePdfFile();

  const srcUrl = useAppSelector((state) => state.files.pdf[fileIndex].srcUrl[renderIndex]);

  return (
    <>
      {srcUrl ? (
        <Document file={srcUrl} loading={<Loader />}>
          {children}
        </Document>
      ) : (
        children
      )}
    </>
  );
};

const Loader = () => {
  return (
    <div className="h-[200px] w-[100px] grid place-items-center">
      <Spinner type="Oval" height="42px" width="42px" />
    </div>
  );
};
