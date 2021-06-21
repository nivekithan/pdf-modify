import { urlToArrayBuffer } from "./urlToArrayBuffer";

export const urlToFiles = async (url: string, fileName: string) => {
  const arrayBuffer = await urlToArrayBuffer(url);
  const unit8Arr = new Uint8Array(arrayBuffer);
  const files = new File([unit8Arr.buffer], fileName, { type: "application/pdf" });
  return files;
};
