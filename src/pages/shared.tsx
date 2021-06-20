import React, { useRef } from "react";

import { PdfFiles } from "src/components/pdf/pdfFiles";
import { useLoadPdfs } from "~hooks/useLoadPdfs";

const Shared = () => {
  const state = useLoadPdfs();

  return <PdfFiles />;
};

export default Shared;
