import React, { useMemo, useCallback } from "react";
import { PageIndex, PdfActions } from "../../pdfActions/pdfActions";
import { downloadLink } from "../../utils/downloadLink";
import { PdfDocument } from "./pdfDocument";
import { PageHolder } from "./pageHolder";
import { PageMenu } from "./pageMenu";
import { PdfLoadError } from "./pdfLoadError";
import { usePdfState } from "../../hooks/usePdfState";
import { PdfLoading } from "./pdfLoading";
import { PdfPageLists } from "./pdfPageLists";
import { DragEndEvent } from "@dnd-kit/core";
import { usePageLists } from "../../hooks/usePageLists";
import { PDFDocument, degrees } from "pdf-lib";
import { FileUrlsActions } from "../../hooks/useFileUrls";
import { urlToArrayBuffer } from "../../utils/urlToArrayBuffer";

type PdfProps = {
  url: string;
  name: string;
  dispatchFileUrls: (actions: FileUrlsActions) => void;
};

export const Pdf = ({ url, name, dispatchFileUrls }: PdfProps) => {
  const [pageLists, setPageLists] = usePageLists();
  const [pdfState, onLoadingSuccess, onLoadingError, onLoadingProgress] = usePdfState(
    (pageNumber, pageRotation) =>
      setPageLists({ type: "create", totalPageNumber: pageNumber, pageRotation })
  );

  const pdfActions = useMemo(() => {
    return new PdfActions(url);
  }, [url]);

  const onRemove = useCallback(
    (renderIndex: number, shift: number) => {
      return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        pdfActions.removePage({ index: renderIndex, shift });
        setPageLists({ type: "removePage", renderIndex: renderIndex });
      };
    },
    [pdfActions, setPageLists]
  );

  const onRotate = useCallback(
    (pageIndex: number, dir: "left" | "right", shift: number) => {
      return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (dir === "left") {
          pdfActions.rotatePage({ index: pageIndex, shift }, -90);
          setPageLists({ type: "rotatePage", renderIndex: pageIndex, rotate: -90 });
        } else if (dir === "right") {
          pdfActions.rotatePage({ index: pageIndex, shift }, 90);
          setPageLists({ type: "rotatePage", renderIndex: pageIndex, rotate: 90 });
        }
      };
    },
    [pdfActions, setPageLists]
  );

  const onDragEnd = useCallback(
    (
      dragEnd: DragEndEvent,
      { activeShift, overShift }: { activeShift: number; overShift: number | null }
    ) => {
      if (dragEnd.over) {
        const fromRenderIndex = Number(dragEnd.active.id);
        const toRenderIndex = Number(dragEnd.over.id);

        pdfActions.reorderPage(
          { index: fromRenderIndex, shift: activeShift },
          { index: toRenderIndex, shift: overShift || 0 }
        );
        setPageLists({
          type: "reorderPage",
          fromRenderIndex,
          toRenderIndex,
        });
      }
    },
    [pdfActions, setPageLists]
  );

  const onSelectCheck = useCallback(
    (renderIndex: number, shift: number) => {
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.currentTarget.checked;

        pdfActions.selectPage({ index: renderIndex, shift }, selected);

        setPageLists({
          type: "setSelectPage",
          select: selected,
          renderIndex: renderIndex,
        });
      };
    },
    [pdfActions, setPageLists]
  );

  const onDownload = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const link = await pdfActions.getNewPdfLink();
    downloadLink(link);
  };

  const onUndo = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      try {
        const lastAction = pdfActions.undo();

        switch (lastAction.type) {
          case "removePage":
            setPageLists({
              type: "removePage",
              renderIndex: lastAction.pageIndex.index,
              reverse: true,
            });
            break;
          case "rotatePage":
            setPageLists({
              type: "rotatePage",
              renderIndex: lastAction.pageIndex.index,
              reverse: true,
              rotate: lastAction.degree,
            });
            break;
          case "reorderPage":
            setPageLists({
              type: "reorderPage",
              fromRenderIndex: lastAction.fromPageIndex.index,
              toRenderIndex: lastAction.toPageIndex.index,
              reverse: true,
            });
            break;
          case "selectPage":
            setPageLists({
              type: "setSelectPage",
              renderIndex: lastAction.pageIndex.index,
              select: lastAction.select,
              reverse: true,
            });
            break;
          case "removeMultiplePage":
            lastAction.pageIndexes.forEach(({ index }) => {
              setPageLists({
                type: "removePage",
                renderIndex: index,
                reverse: true,
              });
            });
            break;
        }
      } catch (err) {
        // TODO
      }
    },
    [pdfActions, setPageLists]
  );

  const onRedo = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      try {
        const lastAction = pdfActions.redo();

        switch (lastAction.type) {
          case "removePage":
            setPageLists({ type: "removePage", renderIndex: lastAction.pageIndex.index });
            break;
          case "rotatePage":
            setPageLists({
              type: "rotatePage",
              renderIndex: lastAction.pageIndex.index,
              rotate: lastAction.degree,
            });
            break;
          case "reorderPage":
            setPageLists({
              type: "reorderPage",
              fromRenderIndex: lastAction.fromPageIndex.index,
              toRenderIndex: lastAction.toPageIndex.index,
            });
            break;
          case "selectPage":
            setPageLists({
              type: "setSelectPage",
              renderIndex: lastAction.pageIndex.index,
              select: lastAction.select,
            });
            break;
          case "removeMultiplePage":
            lastAction.pageIndexes.forEach(({ index }) => {
              setPageLists({
                type: "removePage",
                renderIndex: index,
              });
            });
            break;
        }
      } catch (err) {
        // TODO
      }
    },
    [pdfActions, setPageLists]
  );

  const onReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    try {
      pdfActions.reset();
      setPageLists({ type: "reset" });
    } catch (err) {
      // TODO
    }
  };

  const onSplit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      const [renderIndexes, pageIndexes] = (() => {
        if (!pageLists) {
          throw new Error("The pdf has not been loaded yet");
        }

        let shift = 0;
        const renderIndexes: PageIndex[] = [];
        const pageIndexes: { index: number; rotation: number }[] = [];

        pageLists.forEach((value, i) => {
          if (!value.render) {
            shift++;
            return;
          }

          if (value.selected) {
            renderIndexes.push({ index: i, shift });
            pageIndexes.push({ index: value.index, rotation: value.rotation });
            shift++;
          }
        });

        return [renderIndexes, pageIndexes] as const;
      })();

      if (renderIndexes.length) {
        pdfActions.removeMultiplePage(renderIndexes);

        renderIndexes.forEach(({ index }) => {
          setPageLists({
            type: "removePage",
            renderIndex: index,
          });
        });

        const [newPdfDoc, srcPdfDoc] = await Promise.all([
          PDFDocument.create(),
          PDFDocument.load(await urlToArrayBuffer(url)),
        ]);

        const copiedPages = await newPdfDoc.copyPages(
          srcPdfDoc,
          pageIndexes.map((v) => v.index)
        );

        copiedPages.forEach((page, i) => {
          newPdfDoc.addPage(page);
          newPdfDoc.getPage(i).setRotation(degrees(pageIndexes[i].rotation));
        });

        const uint8Arr = await newPdfDoc.save();
        const newUrl = (() => {
          const bolb = new Blob([uint8Arr.buffer], { type: "application/pdf" });
          return URL.createObjectURL(bolb);
        })();

        dispatchFileUrls({
          type: "pushNewFiles",
          files: [{ name: `${name}-split.pdf`, url: newUrl }],
        });
      }
    },
    [dispatchFileUrls, pageLists, pdfActions, setPageLists, url, name]
  );

  return (
    <PdfDocument
      url={url}
      onLoadSuccess={onLoadingSuccess}
      onLoadError={onLoadingError}
      onLoadProgress={onLoadingProgress}
    >
      <div className="mx-[10%] mb-20">
        <PageHolder>
          {(() => {
            if (pdfState.state === "error") {
              return <PdfLoadError />;
            } else if (pdfState.state === "loading") {
              return <PdfLoading />;
            } else if (pdfState.state === "success" && pageLists !== undefined) {
              return (
                <PdfPageLists
                  onRemove={onRemove}
                  onRotate={onRotate}
                  pageLists={pageLists}
                  onDragEnd={onDragEnd}
                  onToggleSelect={onSelectCheck}
                />
              );
            } else {
              return <div></div>;
            }
          })()}
        </PageHolder>
        <PageMenu
          onUndo={onUndo}
          disableUndo={!pdfActions.canUndo()}
          onRedo={onRedo}
          disableRedo={!pdfActions.canRedo()}
          onApplyChanges={onDownload}
          onReset={onReset}
          disableReset={!pdfActions.canReset()}
          onSplit={onSplit}
        />
      </div>
    </PdfDocument>
  );
};
