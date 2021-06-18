import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { arrayMoveMutate } from "../../utils/arrayMoveMutate";
import { wrapDegree } from "../../utils/wrapDegree";
import { current } from "immer";

export type PdfPage = {
  rotation: number;
  selected: boolean;
};

export type Pdf = {
  name: string;
  pages: PdfPage[];
  initialRotation: number[];

  indexArr: number[];
  renderArr: boolean[];
};

export type Files = { pdf: Pdf[]; urlArr: string[] };

const initialState: Files = { pdf: [], urlArr: [] };

export const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    // File Reducers Responsible for adding, removing pdfFiles

    loadNewFiles: (state, action: PayloadAction<{ pdf: Pdf[]; urlArr: string[] }>) => {
      state.pdf = action.payload.pdf;
      state.urlArr = action.payload.urlArr;

      return state;
    },

    pushNewFiles: (state, action: PayloadAction<{ pdf: Pdf[]; urlArr: string[] }>) => {
      state.pdf.push(...action.payload.pdf);
      state.urlArr.push(...action.payload.urlArr);
      return state;
    },

    removeFile: (state, action: PayloadAction<number>) => {
      state.pdf.splice(action.payload, 1);
      state.urlArr.splice(action.payload, 1);
      return state;
    },

    replaceFile: (state, action: PayloadAction<{ index: number; pdfFile: Pdf; url: string }>) => {
      state.pdf[action.payload.index] = action.payload.pdfFile;
      state.urlArr[action.payload.index] = action.payload.url;
      return state;
    },

    // Page Reducers Responsible for manipulating pdf pages and its properties in a single file

    createPagesInFile: (
      state,
      action: PayloadAction<{ fileIndex: number; totalPageNumber: number; pageRotation: number[] }>
    ) => {
      const { fileIndex, pageRotation, totalPageNumber } = action.payload;

      const [pages, indexArr, renderArr] = Array(totalPageNumber)
        .fill(0)
        .reduce(
          (prev: [PdfPage[], number[], boolean[]], curr: any, i) => {
            prev[0].push({ rotation: pageRotation[i], selected: false });
            prev[1].push(i);
            prev[2].push(true);
            return prev;
          },
          [[], [], []]
        );

      state.pdf[fileIndex].pages = pages;
      state.pdf[fileIndex].indexArr = indexArr;
      state.pdf[fileIndex].renderArr = renderArr;
      state.pdf[fileIndex].initialRotation = pageRotation;

      return state;
    },

    resetPagesInFile: (state, action: PayloadAction<{ fileIndex: number }>) => {
      const { fileIndex } = action.payload;
      const totalPageNumber = state.pdf[fileIndex].pages.length;
      const pageRotation = state.pdf[fileIndex].initialRotation;

      const [pages, indexArr, renderArr] = Array(totalPageNumber)
        .fill(0)
        .reduce(
          (prev: [PdfPage[], number[], boolean[]], curr: any, i) => {
            prev[0].push({ rotation: pageRotation[i], selected: false });
            prev[1].push(i);
            prev[2].push(false);
            return prev;
          },
          [[], [], []]
        );

      state.pdf[fileIndex].pages = pages;
      state.pdf[fileIndex].indexArr = indexArr;
      state.pdf[fileIndex].renderArr = renderArr;

      return state;
    },

    hidePageInFile: (state, action: PayloadAction<{ fileIndex: number; renderIndex: number }>) => {
      const { fileIndex, renderIndex } = action.payload;
      const pdfFile = state.pdf[fileIndex];

      pdfFile.renderArr[renderIndex] = false;
      return state;
    },

    hidePageInFileReverse: (
      state,
      action: PayloadAction<{ fileIndex: number; renderIndex: number }>
    ) => {
      const { fileIndex, renderIndex } = action.payload;
      const pdfFile = state.pdf[fileIndex];
      pdfFile.renderArr[renderIndex] = true;

      return state;
    },

    rotatePageInFile: (
      state,
      action: PayloadAction<{ fileIndex: number; renderIndex: number; rotate: number }>
    ) => {
      const { fileIndex, renderIndex, rotate } = action.payload;
      const pdfFile = state.pdf[fileIndex];
      pdfFile.pages[renderIndex].rotation = wrapDegree(
        pdfFile.pages[renderIndex].rotation + rotate
      );

      return state;
    },

    rotatePageInFileReverse: (
      state,
      action: PayloadAction<{ fileIndex: number; renderIndex: number; rotate: number }>
    ) => {
      const { fileIndex, renderIndex, rotate } = action.payload;
      const pdfFile = state.pdf[fileIndex];
      pdfFile.pages[renderIndex].rotation = wrapDegree(
        pdfFile.pages[renderIndex].rotation - rotate
      );

      return state;
    },

    reorderPageInFile: (
      state,
      action: PayloadAction<{ fileIndex: number; fromRenderIndex: number; toRenderIndex: number }>
    ) => {
      const { fileIndex, fromRenderIndex, toRenderIndex } = action.payload;
      const pdfFile = state.pdf[fileIndex];
      arrayMoveMutate(pdfFile.pages, fromRenderIndex, toRenderIndex);
      arrayMoveMutate(pdfFile.indexArr, fromRenderIndex, toRenderIndex);
      arrayMoveMutate(pdfFile.renderArr, fromRenderIndex, toRenderIndex);
      return state;
    },

    reorderPageInFileReverse: (
      state,
      action: PayloadAction<{ fileIndex: number; fromRenderIndex: number; toRenderIndex: number }>
    ) => {
      const { fileIndex, fromRenderIndex, toRenderIndex } = action.payload;
      const pdfFile = state.pdf[fileIndex];

      arrayMoveMutate(pdfFile.pages, toRenderIndex, fromRenderIndex);
      arrayMoveMutate(pdfFile.indexArr, fromRenderIndex, toRenderIndex);
      arrayMoveMutate(pdfFile.renderArr, fromRenderIndex, toRenderIndex);
      return state;
    },

    setSelectPageInFile: (
      state,
      action: PayloadAction<{ fileIndex: number; renderIndex: number; select: boolean }>
    ) => {
      const { fileIndex, renderIndex, select } = action.payload;
      const pdfFile = state.pdf[fileIndex];

      pdfFile.pages[renderIndex].selected = select;

      return state;
    },

    setSelectPageInFileReverse: (
      state,
      action: PayloadAction<{ fileIndex: number; renderIndex: number; select: boolean }>
    ) => {
      const { fileIndex, renderIndex, select } = action.payload;
      const pdfFile = state.pdf[fileIndex];

      pdfFile.pages[renderIndex].selected = !select;

      return state;
    },
  },
});

export const {
  hidePageInFile,
  createPagesInFile,
  hidePageInFileReverse,
  loadNewFiles,
  pushNewFiles,
  removeFile,
  reorderPageInFile,
  reorderPageInFileReverse,
  replaceFile,
  resetPagesInFile,
  rotatePageInFile,
  rotatePageInFileReverse,
  setSelectPageInFile,
  setSelectPageInFileReverse,
} = fileSlice.actions;

export const fileReducer = fileSlice.reducer;
