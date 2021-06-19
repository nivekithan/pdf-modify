import React from "react";
import { PdfPage } from "./pdfPage";
import { Droppable } from "react-beautiful-dnd";
import { usePdfFile } from "src/context/pdfFileProvider";
import { useAppSelector } from "src/hooks/store";

export const PdfPageLists = () => {
  const { url, index: fileIndex } = usePdfFile();
  const totalLength = useAppSelector((state) => state.files.pdf[fileIndex].pages.length);
  const uniqueArr = useAppSelector((state) => state.files.pdf[fileIndex].uniqueArr);

  return (
    <Droppable droppableId={url} direction="horizontal">
      {({ droppableProps, innerRef, placeholder }) => {
        return (
          <div
            className="border-2 border-gray-300 max-h-[400px] overflow-auto"
            ref={innerRef}
            {...droppableProps}
          >
            <div className="flex mb-20">
              {Array(totalLength)
                .fill(0)
                .map((_, i) => {
                  return <PdfPage key={uniqueArr[i]} renderIndex={i} />;
                })}
              {placeholder}
            </div>
          </div>
        );
      }}
    </Droppable>
  );
};
