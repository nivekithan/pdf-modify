import { Document, pdfjs, LoadingProcessData } from "react-pdf";
import React from "react";
import { usePdfFile } from "src/context/pdfFileProvider";

type PdfDocumentProps = {
  children: React.ReactNode;

  onLoadSuccess: (pdf: pdfjs.PDFDocumentProxy) => void;
  onLoadError: (err: Error) => void;
  onLoadProgress: (data: LoadingProcessData) => void;
};

export const PdfDocument = ({
  children,
  onLoadSuccess,
  onLoadError,
  onLoadProgress,
}: PdfDocumentProps) => {
  const { url } = usePdfFile();

  return (
    <Document
      file={url}
      onLoadSuccess={onLoadSuccess}
      error={<>{children}</>}
      loading={<>{children}</>}
      onLoadError={onLoadError}
      onLoadProgress={onLoadProgress}
    >
      {children}
    </Document>
  );
};
