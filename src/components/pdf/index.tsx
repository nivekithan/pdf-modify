import React, { useState, useMemo } from "react";
import { PdfActions } from "../../pdfActions/pdfActions";
import { downloadLink } from "../../utils/downloadLink";
import { PdfDocument } from "./pdfDocument";
import { PdfPage } from "./pdfPage";
import { PageHolder } from "./pageHolder";
import { PageMenu } from "./pageMenu";
import { fallbackIfUndefined } from "../../utils/fallbackIfUndefined";
import { PdfLoadError } from "./pdfLoadError";
import { usePdfState } from "../../hooks/usePdfState";
import { PdfLoading } from "./pdfLoading";

type PdfProps = {
  url: string;
  name: string;
};

type PageInfo = {
  render: boolean;
  rotation: number;
};

export const Pdf = ({ url }: PdfProps) => {
  const [pageInfo, setPageInfo] = useState<Record<number, PageInfo>>({});
  const [pdfState, onLoadingSuccess, onLoadingError, onLoadingProgress] = usePdfState();

  const pdfActions = useMemo(() => {
    return new PdfActions(url);
  }, [url]);

  const getCanRender = (num: number) => {
    const value = pageInfo[num];

    return fallbackIfUndefined(value?.render, true);
  };

  const getRotation = (pageIndex: number): number => {
    const info = pageInfo[pageIndex];

    return fallbackIfUndefined(info?.rotation, 0);
  };

  const updatePageInfo = (pageIndex: number, info: Partial<PageInfo>) => {
    const render = fallbackIfUndefined(info.render, getCanRender(pageIndex));
    const rotation = fallbackIfUndefined(info.rotation, getRotation(pageIndex));

    setPageInfo((s) => ({ ...s, [pageIndex]: { render, rotation } }));
  };

  const onRemove = (pageIndex: number) => {
    return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      pdfActions.removePage(pageIndex);
      updatePageInfo(pageIndex, { render: false });
    };
  };

  const onRotate = (pageIndex: number, dir: "left" | "right") => {
    return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      if (dir === "left") {
        pdfActions.rotatePage(pageIndex, -90);
        updatePageInfo(pageIndex, { rotation: getRotation(pageIndex) - 90 });
      } else if (dir === "right") {
        pdfActions.rotatePage(pageIndex, 90);
        updatePageInfo(pageIndex, { rotation: getRotation(pageIndex) + 90 });
      }
    };
  };

  const onDownload = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const link = await pdfActions.getNewPdfLink();
    downloadLink(link);
    URL.revokeObjectURL(link);
  };

  const onUndo = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    try {
      const lastAction = pdfActions.undo();

      switch (lastAction.type) {
        case "removePage":
          updatePageInfo(lastAction.pageIndex, { render: true });
          break;
        case "rotatePage":
          updatePageInfo(lastAction.pageIndex, {
            rotation: getRotation(lastAction.pageIndex) - lastAction.degree,
          });
          break;
      }
    } catch (err) {
      // TODO
    }
  };

  const onRedo = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    try {
      const lastAction = pdfActions.redo();

      switch (lastAction.type) {
        case "removePage":
          updatePageInfo(lastAction.pageIndex, { render: false });
          break;
        case "rotatePage":
          updatePageInfo(lastAction.pageIndex, {
            rotation: getRotation(lastAction.pageIndex) + lastAction.degree,
          });
      }
    } catch (err) {
      // TODO
    }
  };

  const onReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    try {
      pdfActions.reset();
      setPageInfo({});
    } catch (err) {
      // TODO
    }
  };

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
            } else if (pdfState.state === "success") {
              return (
                <div className="flex flex-wrap">
                  <PdfPage
                    pageIndexNumber={0}
                    render={getCanRender(0)}
                    onRemove={onRemove(0)}
                    rotate={getRotation(0)}
                    onRotateLeft={onRotate(0, "left")}
                    onRotateRight={onRotate(0, "right")}
                  />
                  <PdfPage
                    pageIndexNumber={1}
                    render={getCanRender(1)}
                    onRemove={onRemove(1)}
                    rotate={getRotation(1)}
                    onRotateLeft={onRotate(1, "left")}
                    onRotateRight={onRotate(1, "right")}
                  />
                  <PdfPage
                    pageIndexNumber={2}
                    render={getCanRender(2)}
                    onRemove={onRemove(2)}
                    rotate={getRotation(2)}
                    onRotateLeft={onRotate(2, "left")}
                    onRotateRight={onRotate(2, "right")}
                  />

                  <PdfPage
                    pageIndexNumber={3}
                    render={getCanRender(3)}
                    onRemove={onRemove(3)}
                    rotate={getRotation(3)}
                    onRotateLeft={onRotate(3, "left")}
                    onRotateRight={onRotate(3, "right")}
                  />
                </div>
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
        />
      </div>
    </PdfDocument>
  );
};
