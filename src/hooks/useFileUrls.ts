import { useImmerReducer, Reducer } from "use-immer";
import { PdfFiles } from "../App";

export type FileUrlsActions = LoadNewFiles | PushNewFiles;

type LoadNewFiles = {
  type: "loadNewFiles";
  files: PdfFiles[];
};

type PushNewFiles = {
  type: "pushNewFiles";
  files: PdfFiles[];
};

const fileUrlsReducer: Reducer<PdfFiles[], FileUrlsActions> = (fileUrls, action) => {
  switch (action.type) {
    case "loadNewFiles":
      return [...action.files];
    case "pushNewFiles":
      fileUrls.push(...action.files);
      return fileUrls;
  }
};

export const useFileUrls = () => {
  return useImmerReducer(fileUrlsReducer, []);
};
