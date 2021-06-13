import { useState } from "react";
import { pdfjs } from "react-pdf";

export const useTotalPages = (): [number | undefined, (pdf: pdfjs.PDFDocumentProxy) => void] => {
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);

  const onLoadSuccess = ({ numPages }: pdfjs.PDFDocumentProxy) => {
    setTotalPages(numPages);
  };

  return [totalPages, onLoadSuccess];
};
