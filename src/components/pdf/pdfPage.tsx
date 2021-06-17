import React, { useRef } from "react";
import { Page } from "react-pdf";

import { ReactComponent as RotateRight } from "../../svg/rotateRight.svg";
import { ReactComponent as RotateLeft } from "../../svg/rotateLeft.svg";
import { ReactComponent as Close } from "../../svg/close.svg";
import { PageInfo } from "../../hooks/usePageLists";
import { Draggable } from "react-beautiful-dnd";

type PdfPageProps = {
  renderIndex: number;
  pageInfo: PageInfo;

  // Button Options
  onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onRotateRight: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onRotateLeft: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onToggleSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;

  disabled: boolean;

  url: string;
};

export const PdfPage = ({
  onRemove,
  onRotateLeft,
  onRotateRight,
  onToggleSelect,
  renderIndex,
  pageInfo,
  disabled,
  url,
}: PdfPageProps) => {
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  const { index, render, rotation } = pageInfo;

  return (
    <Draggable draggableId={`${url}-${index}`} index={renderIndex}>
      {({ draggableProps, innerRef, dragHandleProps }) => {
        return (
          <div
            className={`${
              render ? "" : "hidden"
            } px-5 hover:bg-white-hover h-[260px] py-4 grid place-items-center flex flex-col group`}
            {...dragHandleProps}
            {...draggableProps}
            ref={innerRef}
          >
            <div className="relative">
              <Page
                height={200}
                pageIndex={index}
                className="shadow-pdf cursor-move"
                rotate={rotation}
              />
              <form className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  className="w-6 h-6 focus:shadow-none rounded-sm "
                  checked={pageInfo.selected}
                  onChange={onToggleSelect}
                  ref={checkboxRef}
                />
              </form>
            </div>
            <div className=" flex">
              <button
                className="p-1 text-sm hover:bg-white-hover-darker rounded"
                onClick={onRotateLeft}
              >
                <RotateLeft width="16px" height="16px" opacity="0.6" />
              </button>
              <button onClick={onRemove} className="p-1 text-sm hover:bg-white-hover-darker">
                <Close width="16px" height="16px" opacity="0.6" />
              </button>
              <button
                className="text-sm p-1 hover:bg-white-hover-darker rounded"
                onClick={onRotateRight}
              >
                <RotateRight width="16px" height="16px" opacity="0.6" />
              </button>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
