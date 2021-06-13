import React, { useState, useMemo } from "react";
import { PdfActions } from "../../pdfActions/pdfActions";
import { downloadLink } from "../../utils/downloadLink";
import { PdfDocument } from "./pdfDocument";
import { PdfPage } from "./pdfPage";

type PdfProps = {
  url: string;
};

export const Pdf = ({ url }: PdfProps) => {
  const [canRender, setCanRender] = useState<Record<number, boolean>>({});
  const pdfActions = useMemo(() => {
    return new PdfActions(url);
  }, [url]);

  const getCanRender = (num: number) => {
    const value = canRender[num];

    if (typeof value === "undefined") {
      return true;
    } else {
      return value;
    }
  };

  const onRemove = (pageIndex: number) => {
    return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      pdfActions.removePage(pageIndex);
      setCanRender((s) => ({ ...s, [pageIndex]: false }));
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
          setCanRender((s) => ({ ...s, [lastAction.pageIndex]: true }));
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
          pdfActions.removePage(lastAction.pageIndex);
          setCanRender((s) => ({ ...s, [lastAction.pageIndex]: false }));
      }
    } catch (err) {
      // TODO
    }
  };

  return (
    <PdfDocument
      url={url}
      onUndo={onUndo}
      disableUndo={!pdfActions.canUndo()}
      onRedo={onRedo}
      disableRedo={!pdfActions.canRedo()}
    >
      <div className="flex flex-col gap-y-4">
        <div className="flex gap-x-4">
          <PdfPage pageIndexNumber={1} render={getCanRender(1)} onRemove={onRemove(1)} />
          <PdfPage pageIndexNumber={2} render={getCanRender(2)} onRemove={onRemove(2)} />
          <PdfPage pageIndexNumber={3} render={getCanRender(3)} onRemove={onRemove(3)} />
        </div>
        <button
          className="bg-blue-600 px-3 py-2 text-white rounded-md hover:(bg-blue-800)"
          onClick={onDownload}
        >
          Download
        </button>
      </div>
    </PdfDocument>
  );
};
