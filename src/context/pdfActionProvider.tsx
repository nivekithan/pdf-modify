import React, { createContext } from "react";
import { useContext } from "react";
import { PdfActions } from "~utils/pdfActions";

const pdfAction = createContext<PdfActions | null>(null);

export type PdfActionProviderProps = {
  pdfAction: PdfActions;
  children: React.ReactNode;
};

export const PdfActionProvider = ({ pdfAction: value, children }: PdfActionProviderProps) => {
  return <pdfAction.Provider value={value}>{children}</pdfAction.Provider>;
};

export const usePdfActions = () => {
  const value = useContext(pdfAction);

  if (value === null) {
    throw new Error("Use hook usePdfActions inside PdfActionProvider tree");
  }

  return value;
};
