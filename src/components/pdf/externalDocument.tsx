import React from "react";
import { Document } from "react-pdf";
import { usePdfFile } from "~context/pdfFileProvider";
import { useAppSelector } from "~hooks/store";

type ExternalDocumentProps = {
  renderIndex: number;
  children: React.ReactNode;
};

export const ExternalDocument = ({ renderIndex, children }: ExternalDocumentProps) => {
  const { index: fileIndex } = usePdfFile();

  const srcUrl = useAppSelector((state) => state.files.pdf[fileIndex].srcUrl[renderIndex]);

  return <>{srcUrl ? <Document file={srcUrl}>{children}</Document> : children}</>;
};
