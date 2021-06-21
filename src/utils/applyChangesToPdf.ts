import { PdfPage } from "~store";
import { PdfStore } from "./pdfStore";
import { degrees, PDFDocument } from "pdf-lib";
import { docToUrl } from "./docToUrl";

type ChangedPdfFiles = {
  pages: PdfPage[];
  renderArr: boolean[];
  indexArr: number[];
  srcArr: (string | undefined)[];
};

export const applyChangesToPdf = async (url: string, changedPdf: ChangedPdfFiles) => {
  const { pages, indexArr, renderArr, srcArr } = changedPdf;

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

  for (const [i, page] of pages.entries()) {
    if (!renderArr[i]) {
      shift++;
      continue;
    }

    const currUrl = srcArr[i] || url;
    const currIndex = indexArr[i];

    const [copiedPage] = await newPdf.copyPages(pdfStore.getDocument(currUrl), [currIndex]);
    newPdf.addPage(copiedPage);
    const currPage = newPdf.getPage(i - shift);
    currPage.setRotation(degrees(page.rotation));
  }

  const newUrl = await docToUrl(newPdf);

  return newUrl;
};
