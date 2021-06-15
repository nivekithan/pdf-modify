import React from "react";
import { Page } from "react-pdf";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactComponent as RotateRight } from "../../svg/rotateRight.svg";
import { ReactComponent as RotateLeft } from "../../svg/rotateLeft.svg";
import { ReactComponent as Close } from "../../svg/close.svg";
import { PageInfo } from ".";

type PdfPageProps = {
  renderIndex: number;
  pageInfo: PageInfo;

  // Button Options
  onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onRotateRight: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onRotateLeft: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

  disabled: boolean;
};

export const PdfPage = ({
  onRemove,
  onRotateLeft,
  onRotateRight,
  renderIndex,
  pageInfo,

  disabled,
}: PdfPageProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, active } = useSortable({
    id: `${renderIndex}`,
    disabled,
  });

  const { index, render, rotation } = pageInfo;

  const curActive = active?.id === `${renderIndex}`;

  const style = {
    transform: CSS.Transform.toString(transform) || "",
    transition: transition || "",
    zIndex: curActive ? 1 : 0,
  };

  return (
    <div
      className={`${
        render ? "" : "hidden"
      } px-5 hover:bg-white-hover h-[260px] py-4 grid place-items-center flex flex-col`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Page height={200} pageIndex={index} className="shadow-pdf cursor-move" rotate={rotation} />
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
