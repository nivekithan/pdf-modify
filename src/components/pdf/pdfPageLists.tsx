import React from "react";
import { PdfPage } from "./pdfPage";
import { PageInfo } from "../../hooks/usePageLists";
import { Droppable, DragDropContext, DropResult } from "react-beautiful-dnd";

type PdfPageListsProps = {
  onRemove: (
    num: number,
    shift: number
  ) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onRotate: (
    num: number,
    dir: "left" | "right",
    shift: number
  ) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onDropEnd: (res: DropResult, shift: { destinationShift: number; sourceShift: number }) => void;
  onToggleSelect: (
    renderIndex: number,
    shift: number
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;

  pageLists: PageInfo[];
  url: string;
};

export const PdfPageLists = ({
  onRemove,
  onRotate,
  pageLists,
  onToggleSelect,
  onDropEnd,
  url,
}: PdfPageListsProps) => {
  let shift = 0;
  const indexToShift = new Map<number, number>();

  const convert = (res: DropResult) => {
    const { destination, source } = res;

    console.log({ res });

    if (!destination) return;
    if (destination.index === source.index) return;

    const destinationShift = indexToShift.get(destination.index)!;
    const sourceShift = indexToShift.get(source.index)!;

    onDropEnd(res, { destinationShift, sourceShift });
  };

  return (
    <DragDropContext onDragEnd={convert}>
      <Droppable droppableId={url} direction="horizontal">
        {({ droppableProps, innerRef, placeholder }) => {
          return (
            <div
              className="border-2 border-gray-300 max-h-[400px] overflow-auto"
              ref={innerRef}
              {...droppableProps}
            >
              <div className="flex mb-20">
                {pageLists.map((info, i) => {
                  if (!info.render) {
                    shift++;
                  }

                  indexToShift.set(i, shift);

                  return (
                    <PdfPage
                      pageInfo={info}
                      onRotateRight={onRotate(i, "right", shift)}
                      onRotateLeft={onRotate(i, "left", shift)}
                      onRemove={onRemove(i, shift)}
                      key={info.index}
                      renderIndex={i}
                      disabled={!info.render}
                      onToggleSelect={onToggleSelect(i, shift)}
                      url={url}
                    />
                  );
                })}
                {placeholder}
              </div>
            </div>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};
