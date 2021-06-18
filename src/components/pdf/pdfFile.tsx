import React, { useMemo, useCallback, useState } from "react";
import { PdfActions } from "../../pdfActions/pdfActions";
import { downloadLink } from "../../utils/downloadLink";
import { PdfDocument } from "./pdfDocument";
import { PageHolder } from "./pageHolder";
import { PageMenu } from "./pageMenu";
import { PdfLoadError } from "./pdfLoadError";
import { usePdfState } from "../../hooks/usePdfState";
import { PdfLoading } from "./pdfLoading";
import { PdfPageLists } from "./pdfPageLists";
import { PdfTopMenu } from "./pdfTopMenu";
import { useAppDispatch, useAppSelector } from "src/hooks/store";
import { createPagesInFile } from "~store";
import { PdfActionProvider } from "~context/pdfActionProvider";
import { PdfFileProvider } from "~context/pdfFileProvider";

type PdfProps = {
  index: number;
};

export const PdfFile = ({ index }: PdfProps) => {
  const dispatch = useAppDispatch();
  const url = useAppSelector((state) => state.files.urlArr[index]);
  const name = useAppSelector((state) => state.files.pdf[index].name);

  const [pdfState, onLoadingSuccess, onLoadingError, onLoadingProgress] = usePdfState(
    (pageNumber, pageRotation) =>
      dispatch(createPagesInFile({ fileIndex: index, pageRotation, totalPageNumber: pageNumber }))
  );

  const [docKey, setDocKey] = useState(0);

  const pdfActions = useMemo(() => {
    return new PdfActions(url);
  }, [url]);

  const onRetry = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setDocKey((n) => ++n);
  }, []);

  return (
    <PdfActionProvider pdfAction={pdfActions}>
      <PdfFileProvider name={name} url={url} index={index}>
        <PdfDocument
          onLoadSuccess={onLoadingSuccess}
          onLoadError={onLoadingError}
          onLoadProgress={onLoadingProgress}
          key={docKey}
        >
          <div className="mx-[10%]">
            <PdfTopMenu />
            {(() => {
              if (pdfState.state === "error") {
                return (
                  <PageHolder>
                    <PdfLoadError onRetry={onRetry} />;
                  </PageHolder>
                );
              } else if (pdfState.state === "loading") {
                return (
                  <PageHolder>
                    <PdfLoading />;
                  </PageHolder>
                );
              } else if (pdfState.state === "success") {
                return <PdfPageLists />;
              } else {
                return (
                  <PageHolder>
                    <div></div>;
                  </PageHolder>
                );
              }
            })()}
            <PageMenu
              disableUndo={!pdfActions.canUndo()}
              disableRedo={!pdfActions.canRedo()}
              disableReset={!pdfActions.canReset()}
            />
          </div>
        </PdfDocument>
      </PdfFileProvider>
    </PdfActionProvider>
  );
};
