import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "~hooks/store";
import { PdfFile } from "./pdfFile";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { reorderPageBetweenFiles, reorderPageInFile } from "~store";
import { AddMoreFiles } from "../files/addMoreFiles";
import { PdfActions } from "~utils/pdfActions";

export const PdfFiles = () => {
  const totalFiles = useAppSelector((state) => state.files.pdf.length);
  const urlArr = useAppSelector((state) => state.files.urlArr);

  const pdfActionsArr = useMemo(() => {
    return urlArr.map((url) => {
      return PdfActions.createPdfPActions(url);
    });
  }, [urlArr]);

  const dispatch = useAppDispatch();

  const onDragEnd = (res: DropResult) => {
    const { destination, source } = res;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      if (destination.index === source.index) {
        return;
      }

      const fileIndex = urlArr.indexOf(destination.droppableId);

      pdfActionsArr[fileIndex].reorderPage(source.index, destination.index, dispatch, fileIndex);

      dispatch(
        reorderPageInFile({
          fileIndex,
          fromRenderIndex: source.index,
          toRenderIndex: destination.index,
        })
      );
    } else {
      const fromFileIndex = urlArr.indexOf(source.droppableId);
      const toFileIndex = urlArr.indexOf(destination.droppableId);

      const fromRenderIndex = source.index;
      const toRenderIndex = destination.index;

      const fromPdfAction = pdfActionsArr[fromFileIndex];
      const toPdfAction = pdfActionsArr[toFileIndex];

      fromPdfAction.removePage(fromRenderIndex, dispatch, fromFileIndex);

      toPdfAction.addPage(toRenderIndex, dispatch, toFileIndex);

      dispatch(
        reorderPageBetweenFiles({
          from: { fileIndex: fromFileIndex, renderIndex: fromRenderIndex },
          to: { fileIndex: toFileIndex, renderIndex: toRenderIndex },
        })
      );
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col gap-y-20">
        {totalFiles > 0
          ? Array(totalFiles)
              .fill(0)
              .map((_, i) => {
                return <PdfFile key={urlArr[i]} index={i} pdfActions={pdfActionsArr[i]} />;
              })
          : null}
        {totalFiles > 0 ? <AddMoreFiles /> : null}
      </div>
    </DragDropContext>
  );
};
