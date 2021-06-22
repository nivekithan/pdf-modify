import React from "react";

import { PdfFiles } from "src/components/pdf/pdfFiles";
import { useLoadPdfs } from "~hooks/useLoadPdfs";

const PageNotFound = React.lazy(() => import("src/pages/pageNotFound"));

const Shared = () => {
  const state = useLoadPdfs();

  return <>{state === "error" ? <PageNotFound /> : <PdfFiles />}</>;
};

export default Shared;
