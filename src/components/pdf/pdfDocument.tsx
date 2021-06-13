import { Document, pdfjs } from "react-pdf";
import React from "react";
import { ReactComponent as Redo } from "../../svg/redo.svg";
import { ReactComponent as Undo } from "../../svg/undo.svg";

type PdfDocumentProps = {
  url: string;
  children: React.ReactNode;

  onLoadSuccess: (pdf: pdfjs.PDFDocumentProxy) => void;
};

export const PdfDocument = ({ url, children, onLoadSuccess }: PdfDocumentProps) => {
  return (
    <Document file={url} onLoadSuccess={onLoadSuccess}>
      {children}
    </Document>
  );
};
