import React, { useMemo } from "react";
import { PdfActions } from "../../pdfActions/pdfActions";
import { downloadLink } from "../../utils/downloadLink";
import { PdfDocument } from "./pdfDocument";
import { PageHolder } from "./pageHolder";
import { PageMenu } from "./pageMenu";
import { PdfLoadError } from "./pdfLoadError";
import { usePdfState } from "../../hooks/usePdfState";
import { PdfLoading } from "./pdfLoading";
import { PdfPageLists } from "./pdfPageLists";
import { useImmerReducer, Reducer } from "use-immer";
import { arrayMoveMutate } from "../../utils/arrayMoveMutate";
import { DragEndEvent } from "@dnd-kit/core";
import { wrapDegree } from "../../utils/wrapDegree";

type PdfProps = {
  url: string;
  name: string;
};

export type PageInfo = {
  index: number;
  render: boolean;
  rotation: number;
};

type PageListsActions =
  | PageItemCreateAction
  | PageListsResetAction
  | PageListsRemoveAction
  | PageListsRotateAction
  | PageListsReorderAction;

type PageItemCreateAction = {
  type: "create";
  totalPageNumber: number;
};

type PageListsResetAction = {
  type: "reset";
};

type PageListsRemoveAction = {
  type: "removePage";
  renderIndex: number;
  reverse?: boolean;
};

type PageListsRotateAction = {
  type: "rotatePage";
  renderIndex: number;
  rotate: number;
  reverse?: boolean;
};

type PageListsReorderAction = {
  type: "reorderPage";
  fromRenderIndex: number;
  toRenderIndex: number;
  reverse?: boolean;
};

const pageItemsReducer: Reducer<PageInfo[] | undefined, PageListsActions> = (
  pageItems,
  actions
) => {
  if (actions.type === "create") {
    return Array(actions.totalPageNumber)
      .fill(0)
      .map((_, i) => ({ render: true, rotation: 0, index: i }));
  }

  if (pageItems === undefined) {
    throw new Error("The pageItems is undefined, use PageItemCreateAction to initialize");
  }

  if (actions.type === "reset") {
    return Array(pageItems.length)
      .fill(0)
      .map((_, i) => ({ render: true, rotation: 0, index: i }));
  }

  if (!actions.reverse) {
    switch (actions.type) {
      case "removePage":
        pageItems[actions.renderIndex].render = false;
        return pageItems;
      case "rotatePage":
        pageItems[actions.renderIndex].rotation = wrapDegree(
          pageItems[actions.renderIndex].rotation + actions.rotate
        );
        return pageItems;
      case "reorderPage":
        arrayMoveMutate(pageItems, actions.fromRenderIndex, actions.toRenderIndex);
        return pageItems;
    }
  }

  switch (actions.type) {
    case "removePage":
      pageItems[actions.renderIndex].render = true;
      return pageItems;
    case "rotatePage":
      pageItems[actions.renderIndex].rotation = wrapDegree(
        pageItems[actions.renderIndex].rotation - actions.rotate
      );
      return pageItems;
    case "reorderPage":
      arrayMoveMutate(pageItems, actions.toRenderIndex, actions.fromRenderIndex);
      return pageItems;
  }
};

export const Pdf = ({ url }: PdfProps) => {
  const [pageLists, setPageLists] = useImmerReducer(pageItemsReducer, undefined);
  const [pdfState, onLoadingSuccess, onLoadingError, onLoadingProgress] = usePdfState(
    (pageNumber) => setPageLists({ type: "create", totalPageNumber: pageNumber })
  );

  const pdfActions = useMemo(() => {
    return new PdfActions(url);
  }, [url]);

  const onRemove = (renderIndex: number, shift: number) => {
    return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      pdfActions.removePage({ index: renderIndex, shift });
      setPageLists({ type: "removePage", renderIndex: renderIndex });
    };
  };

  const onRotate = (pageIndex: number, dir: "left" | "right", shift: number) => {
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
  };

  const onDragEnd = (
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
  };

  const onDownload = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const link = await pdfActions.getNewPdfLink();
    downloadLink(link);
  };

  const onUndo = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
      }
    } catch (err) {
      // TODO
    }
  };

  const onReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    try {
      pdfActions.reset();
      setPageLists({ type: "reset" });
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
            } else if (pdfState.state === "success" && pageLists !== undefined) {
              return (
                <PdfPageLists
                  onRemove={onRemove}
                  onRotate={onRotate}
                  pageLists={pageLists}
                  onDragEnd={onDragEnd}
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
        />
      </div>
    </PdfDocument>
  );
};
