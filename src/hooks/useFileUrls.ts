import { useImmerReducer, Reducer } from "use-immer";
import { PdfFiles } from "../App";

export type FileUrlsActions = LoadNewFiles | PushNewFiles | RemoveFile | ReplaceFiles;

type LoadNewFiles = {
  type: "loadNewFiles";
  files: PdfFiles[];
};

type PushNewFiles = {
  type: "pushNewFiles";
  files: PdfFiles[];
};

type RemoveFile = {
  type: "removeFile";
  index: number;
};

type ReplaceFiles = {
  type: "replaceFile";
  index: number;
  pdfFile: PdfFiles;
};

const fileUrlsReducer: Reducer<PdfFiles[], FileUrlsActions> = (fileUrls, action) => {
  switch (action.type) {
    case "loadNewFiles":
      return [...action.files];
    case "pushNewFiles":
      fileUrls.push(...action.files);
      return fileUrls;
    case "removeFile":
      fileUrls.splice(action.index, 1);
      return fileUrls;
    case "replaceFile":
      fileUrls[action.index] = action.pdfFile;
      return fileUrls;
  }
};

export const useFileUrls = () => {
  return useImmerReducer(fileUrlsReducer, []);
};
