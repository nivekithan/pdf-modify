import React from "react";
import { Page } from "react-pdf";

type PdfPageProps = {
  pageIndexNumber: number;

  // Rendering Options
  onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  render: boolean;

  // Rotation Options
  rotate: number;
  onRotateRight: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onRotateLeft: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const PdfPage = ({
  pageIndexNumber,
  onRemove,
  render,
  rotate,
  onRotateLeft,
  onRotateRight,
}: PdfPageProps) => {
  return (
    <div
      className={`${
        render ? "" : "hidden"
      } px-5 hover:bg-white-hover h-[260px] py-4 grid place-items-center flex flex-col`}
    >
      <Page height={200} pageIndex={pageIndexNumber} className="shadow-pdf" rotate={rotate} />
      <div className="py-2 flex">
        <button className="p-2 text-sm hover:bg-white-hover-darker" onClick={onRotateLeft}>
          {"<"}
        </button>
        <button onClick={onRemove} className="p-2 text-sm hover:bg-white-hover-darker">
          X
        </button>
        <button className="text-sm p-2 hover:bg-white-hover-darker" onClick={onRotateRight}>
          {">"}
        </button>
      </div>
    </div>
  );
};
