import React, { useRef } from "react";
import { Page } from "react-pdf";

import { ReactComponent as RotateRight } from "~svg/rotateRight.svg";
import { ReactComponent as RotateLeft } from "~svg/rotateLeft.svg";
import { ReactComponent as Close } from "~svg/close.svg";
import { Draggable } from "react-beautiful-dnd";
import { usePdfFile } from "src/context/pdfFileProvider";
import { useAppDispatch, useAppSelector } from "src/hooks/store";
import { hidePageInFile, rotatePageInFile, setSelectPageInFile } from "~store";
import { usePdfActions } from "~context/pdfActionProvider";

type PdfPageProps = {
  renderIndex: number;
};

export const PdfPage = ({ renderIndex }: PdfPageProps) => {
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useAppDispatch();

  const { url, index: fileIndex } = usePdfFile();
  const pdfAction = usePdfActions();

  const { rotation, selected } = useAppSelector(
    (state) => state.files.pdf[fileIndex].pages[renderIndex]
  );

  const render = useAppSelector((state) => state.files.pdf[fileIndex].renderArr[renderIndex]);

  const index = useAppSelector((s) => s.files.pdf[fileIndex].indexArr[renderIndex]);

  const onToggleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.currentTarget.checked;

    pdfAction.selectPage(renderIndex, selected, dispatch, fileIndex);
    dispatch(setSelectPageInFile({ fileIndex, renderIndex, select: selected }));
  };

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
                  checked={selected}
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
