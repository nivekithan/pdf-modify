import React from "react";
import { Page } from "react-pdf";

type PdfPageProps = {
  pageIndexNumber: number;
  onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  render: boolean;
};

export const PdfPage = ({
  pageIndexNumber,
  onRemove,
  render,
}: PdfPageProps) => {
  return (
    <div className={`${render ? "" : "hidden"} flex flex-col gap-y-3`}>
      <Page
        height={400}
        pageIndex={pageIndexNumber}
        className="border-2 border-transparent hover:(border-blue-800)"
      />
      <button
        className="px-2 py-2 text-sm text-white bg-red-500 hover:(bg-red-700) rounded"
        onClick={onRemove}
      >
        Remove
      </button>
    </div>
  );
};
