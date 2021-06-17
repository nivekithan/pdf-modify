/* eslint-disable react/prop-types */
import React, { forwardRef } from "react";

export const pdfAccept = [
  ".pdf",
  "application/pdf",
  "application/x-pdf",
  "application/vnd.pdf",
  "text/pdf",
  "text/x-pdf",
].join(",");

type PdfInputProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  multiple: boolean;
};

export const PdfInput = forwardRef<HTMLInputElement | null, PdfInputProps>(
  ({ onChange, multiple }, ref) => {
    return (
      <input
        multiple={multiple}
        onChange={onChange}
        ref={ref}
        accept={pdfAccept}
        type="file"
        className="hidden"
      />
    );
  }
);

PdfInput.displayName = "PdfInput";
