import React, { useCallback } from "react";
import { usePdfFile } from "src/context/pdfFileProvider";
import { useAppDispatch, useAppSelector } from "src/hooks/store";
import { urlToArrayBuffer } from "src/utils/urlToArrayBuffer";
import {
  hidePageInFile,
  hidePageInFileReverse,
  pushNewFiles,
  reorderPageInFile,
  reorderPageInFileReverse,
  resetPagesInFile,
  rotatePageInFile,
  rotatePageInFileReverse,
  setSelectPageInFile,
  setSelectPageInFileReverse,
} from "~store";
import { usePdfActions } from "~context/pdfActionProvider";
import { PDFDocument, degrees } from "pdf-lib";
import { downloadLink } from "~utils/downloadLink";

type PageMenuProps = {
  disableUndo: boolean;

  disableRedo: boolean;

  disableReset: boolean;
};

export const PageMenu = ({ disableRedo, disableUndo, disableReset }: PageMenuProps) => {
  const { index: fileIndex } = usePdfFile();
  const dispatch = useAppDispatch();
  const pdfActions = usePdfActions();

  const onRedo = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      try {
        const lastAction = pdfActions.redo();

        switch (lastAction.type) {
          case "removePage":
            dispatch(hidePageInFile({ fileIndex, renderIndex: lastAction.pageIndex }));
            break;
          case "rotatePage":
            dispatch(
              rotatePageInFile({
                fileIndex,
                renderIndex: lastAction.pageIndex,
                rotate: lastAction.degree,
              })
            );
            break;
          case "reorderPage":
            dispatch(
              reorderPageInFile({
                fileIndex,
                fromRenderIndex: lastAction.fromPageIndex,
                toRenderIndex: lastAction.toPageIndex,
              })
            );
            break;
          case "selectPage":
            dispatch(
              setSelectPageInFile({
                fileIndex,
                renderIndex: lastAction.pageIndex,
                select: lastAction.select,
              })
            );
            break;
          case "removeMultiplePage":
            lastAction.pageIndexes.forEach((i) => {
              dispatch(hidePageInFile({ fileIndex, renderIndex: i }));
            });
            break;
        }
      } catch (err) {
        // TODO
      }
    },
    [dispatch, fileIndex, pdfActions]
  );

  const onUndo = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      try {
        const lastAction = pdfActions.undo();

        switch (lastAction.type) {
          case "removePage":
            dispatch(hidePageInFileReverse({ fileIndex, renderIndex: lastAction.pageIndex }));
            break;
          case "rotatePage":
            dispatch(
              rotatePageInFileReverse({
                fileIndex,
                renderIndex: lastAction.pageIndex,
                rotate: lastAction.degree,
              })
            );
            break;
          case "reorderPage":
            dispatch(
              reorderPageInFileReverse({
                fileIndex,
                fromRenderIndex: lastAction.fromPageIndex,
                toRenderIndex: lastAction.toPageIndex,
              })
            );
            break;
          case "selectPage":
            dispatch(
              setSelectPageInFileReverse({
                fileIndex,
                renderIndex: lastAction.pageIndex,
                select: lastAction.select,
              })
            );
            break;
          case "removeMultiplePage":
            lastAction.pageIndexes.forEach((i) => {
              dispatch(hidePageInFileReverse({ fileIndex, renderIndex: i }));
            });
            break;
        }
      } catch (err) {
        // TODO
      }
    },
    [dispatch, fileIndex, pdfActions]
  );

  const onReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    try {
      pdfActions.reset();
      dispatch(resetPagesInFile({ fileIndex }));
    } catch (err) {
      // TODO
    }
  };

  return (
    <div className="border-2 border-gray-300 border-t-0 flex justify-between p-6 flex-wrap gap-y-2">
      <div className="flex gap-x-4 flex-wrap gap-y-2">
        <button
          className={`bg-blue-600  text-white text-md font-semibold px-4 py-2 rounded-md ${
            disableUndo ? "opacity-50" : "hover:bg-blue-800"
          }`}
          onClick={onUndo}
          disabled={disableUndo}
        >
          Undo
        </button>
        <button
          className={`bg-blue-600  text-white text-md font-semibold px-4 py-2 rounded-md ${
            disableRedo ? "opacity-50" : "hover:bg-blue-800"
          }`}
          onClick={onRedo}
          disabled={disableRedo}
        >
          Redo
        </button>
      </div>
      <div className="flex items-center gap-x-4 flex-wrap gap-y-2">
        <button
          className={`bg-red-600  text-white text-sm font-semibold px-4 py-2 rounded-md ${
            disableReset ? "opacity-50" : "hover:bg-red-700"
          }`}
          onClick={onReset}
        >
          Reset Changes
        </button>

        <Split />
        <ApplyChanges />
      </div>
    </div>
  );
};

const Split = () => {
  const { index: fileIndex, url, name } = usePdfFile();

  const pages = useAppSelector((state) => state.files.pdf[fileIndex].pages);
  const renderArr = useAppSelector((state) => state.files.pdf[fileIndex].renderArr);
  const indexArr = useAppSelector((state) => state.files.pdf[fileIndex].indexArr);

  const dispatch = useAppDispatch();

  const onSplit = useCallback(async () => {
    const selectedRenderIndexes: number[] = [];
    const selectedIndex: number[] = [];
    const rotationIndex: number[] = [];

    renderArr.forEach((render, i) => {
      if (pages[i].selected && render) {
        selectedRenderIndexes.push(i);
        selectedIndex.push(indexArr[i]);
        rotationIndex.push(pages[i].rotation);
      }
    });

    const [loadedPdf, newPdf] = await Promise.all([
      (async () => {
        const arrayBuffer = await urlToArrayBuffer(url);
        return PDFDocument.load(arrayBuffer);
      })(),
      PDFDocument.create(),
    ]);
    console.log({ renderArr });
    console.log({ selectedIndex, rotationIndex, selectedRenderIndexes });

    const copiedPages = await newPdf.copyPages(loadedPdf, selectedIndex);

    copiedPages.forEach((page, i) => {
      newPdf.addPage(page);
      const currPage = newPdf.getPage(i);
      currPage.setRotation(degrees(rotationIndex[i]));
    });

    const uint8 = await newPdf.save();

    const newFileName = (() => {
      const splitName = name.split(".");
      const extension = splitName.pop()!;
      splitName.push("-split");
      splitName.push(`.${extension}`);

      return splitName.join("");
    })();

    const newUrl = (() => {
      const bolb = new Blob([uint8.buffer], { type: "application/pdf" });
      return URL.createObjectURL(bolb);
    })();

    selectedRenderIndexes.forEach((renderIndex) => {
      dispatch(hidePageInFile({ fileIndex, renderIndex }));
    });

    dispatch(
      pushNewFiles({
        pdf: [{ name: newFileName, indexArr: [], initialRotation: [], pages: [], renderArr: [] }],
        urlArr: [newUrl],
      })
    );
  }, [dispatch, fileIndex, indexArr, name, pages, renderArr, url]);

  return (
    <button
      className={`bg-purple-600 text-white text-md font-semibold px-6 py-3 rounded-md ${"hover:bg-purple-800"}`}
      onClick={onSplit}
    >
      Split PDF
    </button>
  );
};

const ApplyChanges = () => {
  const { index: fileIndex, url, name } = usePdfFile();

  const pages = useAppSelector((state) => state.files.pdf[fileIndex].pages);
  const renderArr = useAppSelector((state) => state.files.pdf[fileIndex].renderArr);
  const indexArr = useAppSelector((state) => state.files.pdf[fileIndex].indexArr);

  const onApplyChanges = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const arrayBuffer = await urlToArrayBuffer(url);
    const [pdfDoc, newPdfDoc] = await Promise.all([
      PDFDocument.load(arrayBuffer),
      PDFDocument.create(),
    ]);
    let shift = 0;

    for (const [i, index] of indexArr.entries()) {
      if (renderArr[i]) {
        const [copyPages] = await newPdfDoc.copyPages(pdfDoc, [index]);
        newPdfDoc.addPage(copyPages);
        const currPage = newPdfDoc.getPage(i - shift);
        currPage.setRotation(degrees(pages[i].rotation));
      } else {
        shift++;
      }
    }

    const uint8Arr = await newPdfDoc.save();

    const blob = new Blob([uint8Arr.buffer], { type: "application/pdf" });
    const newUrl = URL.createObjectURL(blob);

    downloadLink(newUrl, name);

    URL.revokeObjectURL(newUrl);
  };

  return (
    <button
      className="bg-green-600 hover:bg-green-800 text-white text-md font-semibold px-6 py-3 rounded-md"
      onClick={onApplyChanges}
    >
      Apply Changes
    </button>
  );
};
