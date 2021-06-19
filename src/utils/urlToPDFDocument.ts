import { urlToArrayBuffer } from "./urlToArrayBuffer";
import { PDFDocument } from "pdf-lib";

export const urlToPdfDocument = async (url: string) => {
  const arrayBuffer = await urlToArrayBuffer(url);
  return await PDFDocument.load(arrayBuffer);
};
