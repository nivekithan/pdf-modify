import { Document } from "react-pdf";
import React from "react";

type PdfDocumentProps = {
  url: string;
  children: React.ReactNode;
};

export const PdfDocument = ({ url, children }: PdfDocumentProps) => {
  return (
    <Document file={url}>
      {children}
    </Document>
  );
};
