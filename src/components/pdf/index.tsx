import React, { useMemo, useCallback, useState } from "react";
import { PageIndex, PdfActions } from "../../pdfActions/pdfActions";
import { downloadLink } from "../../utils/downloadLink";
import { PdfDocument } from "./pdfDocument";
import { PageHolder } from "./pageHolder";
import { PageMenu } from "./pageMenu";
import { PdfLoadError } from "./pdfLoadError";
import { usePdfState } from "../../hooks/usePdfState";
import { PdfLoading } from "./pdfLoading";
import { PdfPageLists } from "./pdfPageLists";
import { usePageLists } from "../../hooks/usePageLists";
import { PDFDocument, degrees } from "pdf-lib";
import { FileUrlsActions } from "../../hooks/useFileUrls";
import { urlToArrayBuffer } from "../../utils/urlToArrayBuffer";
import { PdfTopMenu } from "./pdfTopMenu";
import { convertToArrayBuffer } from "../../utils/convertToArrayBuffer";
import { DropResult } from "react-beautiful-dnd";

type PdfProps = {
  url: string;
  name: string;
  index: number;
  dispatchFileUrls: (actions: FileUrlsActions) => void;
};

export const Pdf = ({ url, name, dispatchFileUrls, index }: PdfProps) => {
  const [pageLists, setPageLists] = usePageLists();
  const [pdfState, onLoadingSuccess, onLoadingError, onLoadingProgress] = usePdfState(
    (pageNumber, pageRotation) =>
      setPageLists({ type: "create", totalPageNumber: pageNumber, pageRotation })
  );
  const [docKey, setDocKey] = useState(0);

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

  const onDownload = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      if (!pageLists) {
        return;
      }
      const link = await pdfActions.getNewPdfLink();
      downloadLink(link);
    },
    [pageLists, pdfActions]
  );

  const onClose = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      URL.revokeObjectURL(url);
      dispatchFileUrls({
        type: "removeFile",
        index,
      });
    },
    [dispatchFileUrls, index, url]
  );

  const onRetry = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setDocKey((n) => ++n);
  }, []);

  const onLoadNewFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files;

      if (!files || files.length > 1) {
        throw new Error(
          "This event listener should only be attached to a input element whose type is file and multiple is set to false"
        );
      }

      if (files.length === 0) {
        dispatchFileUrls({ type: "removeFile", index });
        e.target.value = "";
        return;
      }

      const fileArr = Array.from(files);

      const arrayBuffers = await Promise.all(fileArr.map(convertToArrayBuffer));
      const urls = arrayBuffers.map((buffers, i) => {
        const blob = new Blob([buffers], { type: "application/pdf" });
        return { url: URL.createObjectURL(blob), name: fileArr[i].name };
      });

      dispatchFileUrls({ type: "replaceFile", index, pdfFile: urls[0] });

      e.target.value = "";
    },
    [dispatchFileUrls, index]
  );

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

      if (!pageLists) {
        return;
      }

      const [renderIndexes, pageIndexes] = (() => {
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

        const newFileName = (() => {
          const splitName = name.split(".");
          const exten = splitName.pop();
          splitName.push("-split");
          splitName.push(exten || "");
          return splitName.join("");
        })();

        dispatchFileUrls({
          type: "pushNewFiles",
          files: [{ name: newFileName, url: newUrl }],
        });
      }
    },
    [dispatchFileUrls, pageLists, pdfActions, setPageLists, url, name]
  );

  const onDropEnd = (res: DropResult, shift: { sourceShift: number; destinationShift: number }) => {
    const { destination, source } = res;

    if (!destination) {
      return;
    }

    if (destination.index === source.index) {
      return;
    }

    setPageLists({
      type: "reorderPage",
      toRenderIndex: destination.index,
      fromRenderIndex: source.index,
    });

    pdfActions.reorderPage(
      { index: source.index, shift: shift.sourceShift },
      { index: destination.index, shift: shift.destinationShift }
    );
  };
  return (
    <PdfDocument
      url={url}
      onLoadSuccess={onLoadingSuccess}
      onLoadError={onLoadingError}
      onLoadProgress={onLoadingProgress}
      key={docKey}
    >
      <div className="mx-[10%]">
        <PdfTopMenu title={name} onClose={onClose} />
        {(() => {
          if (pdfState.state === "error") {
            return (
              <PageHolder>
                <PdfLoadError onRetry={onRetry} onLoadNewFile={onLoadNewFile} />;
              </PageHolder>
            );
          } else if (pdfState.state === "loading") {
            return (
              <PageHolder>
                <PdfLoading />;
              </PageHolder>
            );
          } else if (pdfState.state === "success" && pageLists !== undefined) {
            return (
              <PdfPageLists
                onRemove={onRemove}
                onRotate={onRotate}
                pageLists={pageLists}
                onToggleSelect={onSelectCheck}
                onDropEnd={onDropEnd}
                url={url}
              />
            );
          } else {
            return (
              <PageHolder>
                <div></div>;
              </PageHolder>
            );
          }
        })()}
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
