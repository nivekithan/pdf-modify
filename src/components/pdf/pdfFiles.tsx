import React from "react";
import { useAppDispatch, useAppSelector } from "~hooks/store";
import { PdfFile } from "./pdfFile";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { reorderPageInFile } from "~store";
import { AddMoreFiles } from "../files/addMoreFiles";

export const PdfFiles = () => {
  const totalFiles = useAppSelector((state) => state.files.pdf.length);
  const urlArr = useAppSelector((state) => state.files.urlArr);
  const dispatch = useAppDispatch();

  const onDragEnd = (res: DropResult) => {
    const { destination, source } = res;

    if (!destination) {
      return;
    }

    if (destination.index === source.index) {
      return;
    }

    dispatch(
      reorderPageInFile({
        fileIndex: 0,
        fromRenderIndex: source.index,
        toRenderIndex: destination.index,
      })
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col gap-y-20">
        {totalFiles > 0
          ? Array(totalFiles)
              .fill(0)
              .map((_, i) => {
                return <PdfFile key={urlArr[i]} index={i} />;
              })
          : null}
        {totalFiles > 0 ? <AddMoreFiles /> : null}
      </div>
    </DragDropContext>
  );
};
