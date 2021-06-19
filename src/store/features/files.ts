import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { arrayInsertMutate } from "~utils/arrayInsertMutate";
import { arrayMoveMutate } from "../../utils/arrayMoveMutate";
import { wrapDegree } from "../../utils/wrapDegree";
import { current } from "immer";
import { nanoid } from "nanoid";

export type PdfPage = {
  rotation: number;
  selected: boolean;
};

export type Pdf = {
  name: string;
  pages: PdfPage[];

  initialRotation: number[];
  initialUniqueArr: string[];

  indexArr: number[];
  renderArr: boolean[];
  srcUrl: (string | undefined)[];

  uniqueArr: string[];

  undoLength: number;
  redoLength: number;
  selectLength: number;
};

export type Files = { pdf: Pdf[]; urlArr: string[] };

const initialState: Files = { pdf: [], urlArr: [] };

export const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    // Reducers for maintaining undo , redo, select length states;
    increaseUndo: (state, action: PayloadAction<{ fileIndex: number }>) => {
      const { fileIndex } = action.payload;

      state.pdf[fileIndex].undoLength++;
      return state;
    },

    decreaseUndo: (state, action: PayloadAction<{ fileIndex: number }>) => {
      const { fileIndex } = action.payload;

      state.pdf[fileIndex].undoLength && state.pdf[fileIndex].undoLength--;
      return state;
    },

    resetUndo: (state, action: PayloadAction<{ fileIndex: number }>) => {
      const { fileIndex } = action.payload;

      state.pdf[fileIndex].undoLength = 0;
      return state;
    },

    increaseRedo: (state, action: PayloadAction<{ fileIndex: number }>) => {
      const { fileIndex } = action.payload;

      state.pdf[fileIndex].redoLength++;
      return state;
    },

    decreaseRedo: (state, action: PayloadAction<{ fileIndex: number }>) => {
      const { fileIndex } = action.payload;

      state.pdf[fileIndex].redoLength && state.pdf[fileIndex].redoLength--;
      return state;
    },

    resetRedo: (state, action: PayloadAction<{ fileIndex: number }>) => {
      const { fileIndex } = action.payload;

      state.pdf[fileIndex].redoLength = 0;
      return state;
    },

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

      const [pages, indexArr, renderArr, srcArr, uniqueArr] = Array(totalPageNumber)
        .fill(0)
        .reduce(
          (prev: [PdfPage[], number[], boolean[], undefined[], string[]], curr: any, i) => {
            prev[0].push({ rotation: pageRotation[i], selected: false });
            prev[1].push(i);
            prev[2].push(true);
            prev[3].push(undefined);
            prev[4].push(nanoid());
            return prev;
          },
          [[], [], [], [], []]
        );

      state.pdf[fileIndex].pages = pages;
      state.pdf[fileIndex].indexArr = indexArr;
      state.pdf[fileIndex].renderArr = renderArr;
      state.pdf[fileIndex].initialRotation = pageRotation;
      state.pdf[fileIndex].srcUrl = srcArr;
      state.pdf[fileIndex].uniqueArr = uniqueArr;
      state.pdf[fileIndex].initialUniqueArr = uniqueArr;

      return state;
    },

    resetPagesInFile: (state, action: PayloadAction<{ fileIndex: number }>) => {
      const { fileIndex } = action.payload;
      const totalPageNumber = state.pdf[fileIndex].initialRotation.length;
      const pageRotation = state.pdf[fileIndex].initialRotation;
      const initialUniqueArr = state.pdf[fileIndex].initialUniqueArr;

      const [pages, indexArr, renderArr, srcUrl, uniqueArr] = Array(totalPageNumber)
        .fill(0)
        .reduce(
          (prev: [PdfPage[], number[], boolean[], undefined[], string[]], curr: any, i) => {
            prev[0].push({ rotation: pageRotation[i], selected: false });
            prev[1].push(i);
            prev[2].push(true);
            prev[3].push(undefined);
            prev[4].push(initialUniqueArr[i]);
            return prev;
          },
          [[], [], [], [], []]
        );

      state.pdf[fileIndex].pages = pages;
      state.pdf[fileIndex].indexArr = indexArr;
      state.pdf[fileIndex].renderArr = renderArr;
      state.pdf[fileIndex].srcUrl = srcUrl;
      state.pdf[fileIndex].selectLength = 0;
      state.pdf[fileIndex].uniqueArr = uniqueArr;

      return state;
    },

    hidePageInFile: (state, action: PayloadAction<{ fileIndex: number; renderIndex: number }>) => {
      const { fileIndex, renderIndex } = action.payload;
      const pdfFile = state.pdf[fileIndex];

      pdfFile.renderArr[renderIndex] = false;

      if (pdfFile.pages[renderIndex].selected) {
        pdfFile.selectLength && pdfFile.selectLength--;
      }

      return state;
    },

    hidePageInFileReverse: (
      state,
      action: PayloadAction<{ fileIndex: number; renderIndex: number }>
    ) => {
      const { fileIndex, renderIndex } = action.payload;

      const pdfFile = state.pdf[fileIndex];
      pdfFile.renderArr[renderIndex] = true;

      if (pdfFile.pages[renderIndex].selected) {
        pdfFile.selectLength++;
      }

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
      arrayMoveMutate(pdfFile.srcUrl, fromRenderIndex, toRenderIndex);
      arrayMoveMutate(pdfFile.uniqueArr, fromRenderIndex, toRenderIndex);

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
      arrayMoveMutate(pdfFile.srcUrl, fromRenderIndex, toRenderIndex);
      arrayMoveMutate(pdfFile.uniqueArr, fromRenderIndex, toRenderIndex);

      return state;
    },

    setSelectPageInFile: (
      state,
      action: PayloadAction<{ fileIndex: number; renderIndex: number; select: boolean }>
    ) => {
      const { fileIndex, renderIndex, select } = action.payload;
      const pdfFile = state.pdf[fileIndex];

      pdfFile.pages[renderIndex].selected = select;

      if (select) {
        pdfFile.selectLength++;
      } else {
        pdfFile.selectLength && pdfFile.selectLength--;
      }

      return state;
    },

    setSelectPageInFileReverse: (
      state,
      action: PayloadAction<{ fileIndex: number; renderIndex: number; select: boolean }>
    ) => {
      const { fileIndex, renderIndex, select } = action.payload;
      const pdfFile = state.pdf[fileIndex];

      pdfFile.pages[renderIndex].selected = !select;

      if (select) {
        pdfFile.selectLength && pdfFile.selectLength--;
      } else {
        pdfFile.selectLength++;
      }

      return state;
    },

    // Reducers for manipulating pdf pages between files

    reorderPageBetweenFiles: (
      state,
      action: PayloadAction<{
        from: { fileIndex: number; renderIndex: number };
        to: { fileIndex: number; renderIndex: number };
      }>
    ) => {
      const {
        from: { fileIndex: fromFileIndex, renderIndex: fromRenderIndex },
        to: { fileIndex: toFileIndex, renderIndex: toRenderIndex },
      } = action.payload;

      const fromFile = state.pdf[fromFileIndex];
      const toFile = state.pdf[toFileIndex];

      const fromSrcUrl = state.urlArr[fromFileIndex];
      const fromPageRotation = state.pdf[fromFileIndex].pages[fromRenderIndex].rotation;

      // Hiding Page from files
      fromFile.renderArr[fromRenderIndex] = false;

      if (fromFile.pages[fromRenderIndex].selected) {
        fromFile.selectLength && fromFile.selectLength--;
      }

      // Add Page to ToFile;
      arrayInsertMutate(toFile.indexArr, fromFile.indexArr[fromRenderIndex], toRenderIndex);
      arrayInsertMutate(
        toFile.pages,
        { rotation: fromPageRotation, selected: false },
        toRenderIndex
      );
      arrayInsertMutate(toFile.renderArr, true, toRenderIndex);
      arrayInsertMutate(toFile.srcUrl, fromSrcUrl, toRenderIndex);
      arrayInsertMutate(toFile.uniqueArr, nanoid(), toRenderIndex);
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
  decreaseRedo,
  decreaseUndo,
  increaseRedo,
  increaseUndo,
  resetUndo,
  resetRedo,
  reorderPageBetweenFiles,
} = fileSlice.actions;

export const fileReducer = fileSlice.reducer;
