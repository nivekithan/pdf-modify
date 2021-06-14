import { Document, pdfjs, LoadingProcessData } from "react-pdf";
import React from "react";

type PdfDocumentProps = {
  url: string;
  children: React.ReactNode;

  onLoadSuccess: (pdf: pdfjs.PDFDocumentProxy) => void;
  onLoadError: (err: Error) => void;
  onLoadProgress: (data: LoadingProcessData) => void;
};

export const PdfDocument = ({
  url,
  children,
  onLoadSuccess,
  onLoadError,
  onLoadProgress,
}: PdfDocumentProps) => {
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
