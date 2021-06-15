import React from "react";
import { PdfPage } from "./pdfPage";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { PageInfo } from ".";

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
  onDragEnd: (
    dragEnd: DragEndEvent,
    shift: { activeShift: number; overShift: number | null }
  ) => void;

  pageLists: PageInfo[];
};

export const PdfPageLists = ({ onRemove, onRotate, pageLists, onDragEnd }: PdfPageListsProps) => {
  let shift = 0;
  const indexToShift = new Map<string, number>();

  const convert = (dragEndEvent: DragEndEvent) => {
    if (dragEndEvent.active.id === dragEndEvent.over?.id) {
      return;
    }

    const activeShift = indexToShift.get(dragEndEvent.active.id)!;
    const overShift = dragEndEvent.over ? indexToShift.get(dragEndEvent.over.id)! : null;

    onDragEnd(dragEndEvent, { activeShift, overShift });
  };

  return (
    <DndContext onDragEnd={convert}>
      <SortableContext items={pageLists.map((_, i) => `${i}`)}>
        <div className="flex flex-wrap">
          {pageLists.map((info, i) => {
            if (!info.render) {
              shift++;
            }

            indexToShift.set(`${i}`, shift);

            return (
              <PdfPage
                pageInfo={info}
                onRotateRight={onRotate(i, "right", shift)}
                onRotateLeft={onRotate(i, "left", shift)}
                onRemove={onRemove(i, shift)}
                key={info.index}
                renderIndex={i}
                disabled={!info.render}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};
