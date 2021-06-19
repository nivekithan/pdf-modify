import { PDFDocument } from "pdf-lib";
import { urlToPdfDocument } from "~utils/urlToPDFDocument";

export class PdfStore {
  private store: Record<string, PDFDocument>;

  private constructor(pdfDoc: Record<string, PDFDocument>) {
    this.store = pdfDoc;
  }

  static async loadStore(url: string[]) {
    const urlArr = Array.from(new Set(url));

    const PdfLoad = await Promise.all(urlArr.map(urlToPdfDocument));

    const store: Record<string, PDFDocument> = {};

    PdfLoad.forEach((doc, i) => {
      store[url[i]] = doc;
    });

    return new PdfStore(store);
  }

  getPage(url: string, pageIndex: number) {
    if (this.store[url]) {
      const doc = this.store[url];
      return doc.getPage(pageIndex);
    } else {
      throw new Error("There is no associated document with the url: " + url);
    }
  }

  getRotation(url: string, pageIndex: number) {
    if (this.store[url]) {
      const doc = this.store[url];
      return doc.getPage(pageIndex);
    } else {
      throw new Error("There is no associated document with the url: " + url);
    }
  }

  getDocument(url: string) {
    if (this.store[url]) {
      return this.store[url];
    } else {
      throw new Error("There is no associated document with the url: " + url);
    }
  }
}
