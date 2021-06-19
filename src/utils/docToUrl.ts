import { PDFDocument } from "pdf-lib";

export const docToUrl = async (doc: PDFDocument) => {
  const unit8 = await doc.save();
  const bolb = new Blob([unit8.buffer], { type: "application/pdf" });
  return URL.createObjectURL(bolb);
};
