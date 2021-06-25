import React, { useCallback, useState } from "react";
import { usePdfFile } from "src/context/pdfFileProvider";
import { useAppDispatch, useAppSelector } from "src/hooks/store";
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
import { PdfStore } from "~utils/pdfStore";
import { docToUrl } from "~utils/docToUrl";
import { applyChangesToPdf } from "~utils/applyChangesToPdf";
import Loader from "react-loader-spinner";
import { ReactComponent as DownloadIcon } from "~svg/download.svg";

export const PageMenu = () => {
  const { index: fileIndex } = usePdfFile();
  const dispatch = useAppDispatch();
  const pdfActions = usePdfActions();

  const disableRedo = useAppSelector((state) => !(state.files.pdf[fileIndex].redoLength > 0));
  const disableUndo = useAppSelector((state) => !(state.files.pdf[fileIndex].undoLength > 0));
  const disableReset = disableUndo && disableRedo;

  const onRedo = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      try {
        const lastAction = pdfActions.redo(dispatch, fileIndex);

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
          case "addPage":
            dispatch(hidePageInFileReverse({ fileIndex, renderIndex: lastAction.pageIndex }));
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
        const lastAction = pdfActions.undo(dispatch, fileIndex);

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
          case "addPage":
            dispatch(hidePageInFile({ fileIndex, renderIndex: lastAction.pageIndex }));
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
      pdfActions.reset(dispatch, fileIndex);
      dispatch(resetPagesInFile({ fileIndex }));
    } catch (err) {
      // TODO
    }
  };

  return (
    <div className="border-2 border-gray-300 border-t-0 flex justify-between p-6 flex-wrap gap-y-2">
      <div className="flex gap-x-4 flex-wrap gap-y-2">
        <button
          className={`bg-white-hover text-md font-semibold px-4 py-2 rounded-md animate-opacity  ${
            disableUndo
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-white-hover-darker animate-hover"
          }`}
          onClick={onUndo}
          disabled={disableUndo}
        >
          Undo
        </button>
        <button
          className={`bg-white-hover text-md font-semibold px-4 py-2 rounded-md animate-opacity ${
            disableRedo
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-white-hover-darker animate-hover"
          }`}
          onClick={onRedo}
          disabled={disableRedo}
        >
          Redo
        </button>
      </div>
      <div className="flex items-center gap-x-4 flex-wrap gap-y-2">
        <button
          className={`bg-white-hover text-sm font-semibold px-4 py-2 rounded-md animate-opacity ${
            disableReset
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-white-hover-darker animate-hover"
          }`}
          onClick={onReset}
          disabled={disableReset}
        >
          Reset
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
  const disableSplit = useAppSelector((state) => !(state.files.pdf[fileIndex].selectLength > 0));
  const srcArr = useAppSelector((state) => state.files.pdf[fileIndex].srcUrl);

  const pdfAction = usePdfActions();

  const dispatch = useAppDispatch();

  const onSplit = useCallback(async () => {
    const externalSrcUrl: string[] = [];

    for (const url of srcArr) {
      if (url) {
        externalSrcUrl.push(url);
      }
    }

    const [newPdf, pdfStore] = await Promise.all([
      PDFDocument.create(),
      PdfStore.loadStore([url, ...externalSrcUrl]),
    ]);

    let shift = 0;
    const selectedRenderIndexes: number[] = [];

    for (const [i, page] of pages.entries()) {
      if (!renderArr[i]) {
        shift++;
        continue;
      }

      if (!page.selected) {
        shift++;
        continue;
      }

      const currUrl = srcArr[i] || url;
      const currIndex = indexArr[i];

      const [copiedPage] = await newPdf.copyPages(pdfStore.getDocument(currUrl), [currIndex]);
      newPdf.addPage(copiedPage);
      const currPage = newPdf.getPage(i - shift);
      currPage.setRotation(degrees(page.rotation));
      selectedRenderIndexes.push(i);
    }

    const newUrl = await docToUrl(newPdf);
    const newFileName = (() => {
      const splitName = name.split(".");
      const extension = splitName.pop()!;
      splitName.join("");
      splitName.push("-split");
      splitName.push(`.${extension}`);
      return splitName.join("");
    })();

    pdfAction.removeMultiplePage(selectedRenderIndexes, dispatch, fileIndex);

    selectedRenderIndexes.forEach((renderIndex) => {
      dispatch(hidePageInFile({ fileIndex, renderIndex }));
    });

    dispatch(
      pushNewFiles({
        pdf: [
          {
            name: newFileName,
            indexArr: [],
            initialRotation: [],
            pages: [],
            renderArr: [],
            redoLength: 0,
            undoLength: 0,
            selectLength: 0,
            srcUrl: [],
            uniqueArr: [],
            initialUniqueArr: [],
          },
        ],
        urlArr: [newUrl],
      })
    );
  }, [dispatch, fileIndex, indexArr, name, pages, pdfAction, renderArr, srcArr, url]);

  return (
    <button
      className={`bg-white-hover text-md font-semibold px-6 py-3 rounded-md animate-opacity ${
        disableSplit ? "cursor-not-allowed opacity-50" : "hover:bg-white-hover-darker animate-hover"
      }`}
      onClick={onSplit}
      disabled={disableSplit}
    >
      Split
    </button>
  );
};

const ApplyChanges = () => {
  const { index: fileIndex, url, name } = usePdfFile();
  const [state, setState] = useState<"stale" | "loading" | "success">("stale");

  const pages = useAppSelector((state) => state.files.pdf[fileIndex].pages);
  const renderArr = useAppSelector((state) => state.files.pdf[fileIndex].renderArr);
  const indexArr = useAppSelector((state) => state.files.pdf[fileIndex].indexArr);
  const srcArr = useAppSelector((state) => state.files.pdf[fileIndex].srcUrl);

  const onApplyChanges = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (state === "loading") {
      return;
    }
    try {
      setState("loading");
      const newUrl = await applyChangesToPdf(url, { indexArr, pages, renderArr, srcArr });

      // Create small artificial timeout, it looks nice.
      await new Promise((r) => setTimeout(r, 500));

      downloadLink(newUrl, name);
      setState("success");
      URL.revokeObjectURL(newUrl);
    } catch (err) {
      setState("stale");
    }
  };

  return (
    <button
      className="bg-blue-600 hover:bg-blue-800 animate-hover text-white text-md font-semibold px-6 py-3 rounded-md"
      onClick={onApplyChanges}
    >
      {state === "loading" ? (
        <div className="min-w-[136px] min-h-[22px] ">
          <Loader type="Oval" width="16px" height="16px" visible color="#FFF" />
        </div>
      ) : (
        <span className="flex items-center gap-x-1">
          Apply Changes
          <DownloadIcon />
        </span>
      )}
    </button>
  );
};
