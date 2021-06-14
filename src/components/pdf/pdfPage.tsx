import React from "react";
import { Page } from "react-pdf";
import { ReactComponent as RotateRight } from "../../svg/rotateRight.svg";
import { ReactComponent as RotateLeft } from "../../svg/rotateLeft.svg";
import { ReactComponent as Close } from "../../svg/close.svg";

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
        <button className="p-2 text-sm hover:bg-white-hover-darker rounded" onClick={onRotateLeft}>
          <RotateLeft width="16px" height="16px" opacity="0.6" />
        </button>
        <button onClick={onRemove} className="p-2 text-sm hover:bg-white-hover-darker">
          <Close width="16px" height="16px" opacity="0.6" />
        </button>
        <button className="text-sm p-2 hover:bg-white-hover-darker rounded" onClick={onRotateRight}>
          <RotateRight width="16px" height="16px" opacity="0.6" />
        </button>
      </div>
    </div>
  );
};
