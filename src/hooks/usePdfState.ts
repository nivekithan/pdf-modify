import { useState } from "react";
import { pdfjs } from "react-pdf";
import { PageInfo } from "../components/pdf";

export type PdfState = PdfSuccessState | PdfLoadingState | PdfErrorState | PdfStaleState;

export type PdfSuccessState = {
  state: "success";
  totalPageNumber: number;
  error: undefined;
};

export type PdfLoadingState = {
  state: "loading";
  totalPageNumber: undefined;
  error: undefined;
};

export type PdfErrorState = {
  state: "error";
  totalPageNumber: undefined;
  error: Error;
};

export type PdfStaleState = {
  state: "stale";
  totalPageNumber: undefined;
  error: undefined;
};

export const usePdfState = (
  callback: (totalPageNumber: number) => void
): [PdfState, (doc: pdfjs.PDFDocumentProxy) => void, (err: Error) => void, () => void] => {
  const [pdfState, setPdfState] = useState<PdfState>(createState("stale"));

  const onLoadSuccess = ({ numPages }: pdfjs.PDFDocumentProxy) => {
    setPdfState(createState("success", numPages));
    callback(numPages);
  };

  const onLoadError = (err: Error) => {
    setPdfState(createState("error", err));
  };

  const onLoadingProgress = () => {
    // This function will be called multiple times, therefore we have to make sure
    // that we wont update state unnecessary

    if (pdfState.state !== "loading") {
      setPdfState(createState("loading"));
    }
  };

  return [pdfState, onLoadSuccess, onLoadError, onLoadingProgress];
};

function createState(state: "stale"): PdfStaleState;
function createState(state: "loading"): PdfLoadingState;
function createState(state: "success", totalPageNumber: number): PdfSuccessState;
function createState(state: "error", error: Error): PdfErrorState;

function createState(state: PdfState["state"], data?: number | Error) {
  switch (state) {
    case "loading":
      return { state: "loading", totalPageNumber: undefined, error: undefined };
    case "error":
      return { state: "error", totalPageNumber: undefined, error: data as Error };
    case "success":
      return { state: "success", totalPageNumber: data as number, error: undefined };
    case "stale":
      return { state: "stale", totalPageNumber: undefined, error: undefined };
  }
}
