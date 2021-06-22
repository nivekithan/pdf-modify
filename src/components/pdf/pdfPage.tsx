import React from "react";
import { Page } from "react-pdf";

import { ReactComponent as RotateRight } from "~svg/rotateRight.svg";
import { ReactComponent as RotateLeft } from "~svg/rotateLeft.svg";
import { ReactComponent as Close } from "~svg/close.svg";
import { Draggable } from "react-beautiful-dnd";
import { usePdfFile } from "src/context/pdfFileProvider";
import { useAppDispatch, useAppSelector } from "src/hooks/store";
import { hidePageInFile, rotatePageInFile } from "~store";
import { usePdfActions } from "~context/pdfActionProvider";
import { Checkbox } from "./checkbox";
import { ExternalDocument } from "./externalDocument";

type PdfPageProps = {
  renderIndex: number;
};

export const PdfPage = ({ renderIndex }: PdfPageProps) => {
  const dispatch = useAppDispatch();

  const { index: fileIndex } = usePdfFile();
  const pdfAction = usePdfActions();

  const rotation = useAppSelector(
    (state) => state.files.pdf[fileIndex].pages[renderIndex].rotation
  );

  const render = useAppSelector((state) => state.files.pdf[fileIndex].renderArr[renderIndex]);

  const index = useAppSelector((s) => s.files.pdf[fileIndex].indexArr[renderIndex]);

  const unique = useAppSelector((s) => s.files.pdf[fileIndex].uniqueArr[renderIndex]);

  const onRotateLeft = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    pdfAction.rotatePage(renderIndex, -90, dispatch, fileIndex);
    dispatch(rotatePageInFile({ fileIndex, renderIndex, rotate: -90 }));
  };

  const onRotateRight = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    pdfAction.rotatePage(renderIndex, 90, dispatch, fileIndex);
    dispatch(rotatePageInFile({ fileIndex, renderIndex, rotate: 90 }));
  };

  const onRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    pdfAction.removePage(renderIndex, dispatch, fileIndex);
    dispatch(hidePageInFile({ fileIndex, renderIndex }));
  };

  return (
    <Draggable draggableId={unique} index={renderIndex}>
      {({ draggableProps, innerRef, dragHandleProps }) => {
        return (
          <div {...dragHandleProps} {...draggableProps} ref={innerRef}>
            <div
              className={`${
                render ? "" : "hidden"
              } px-5 hover:bg-white-hover animate-hover h-[260px] py-4 grid place-items-center flex flex-col group`}
            >
              <div className="relative">
                <ExternalDocument renderIndex={renderIndex}>
                  <Page
                    height={200}
                    pageIndex={index}
                    className="shadow-pdf cursor-move"
                    rotate={rotation}
                  />
                </ExternalDocument>
                <Checkbox renderIndex={renderIndex} />
              </div>
              <div className=" flex">
                <button
                  className="p-1 text-sm hover:bg-white-hover-darker animate-hover rounded"
                  onClick={onRotateLeft}
                >
                  <RotateLeft width="16px" height="16px" opacity="0.6" />
                </button>
                <button
                  onClick={onRemove}
                  className="p-1 text-sm hover:bg-white-hover-darker animate-hover"
                >
                  <Close width="16px" height="16px" opacity="0.6" />
                </button>
                <button
                  className="text-sm p-1 hover:bg-white-hover-darker animate-hover rounded"
                  onClick={onRotateRight}
                >
                  <RotateRight width="16px" height="16px" opacity="0.6" />
                </button>
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
