import {
  AppDispatch,
  decreaseRedo,
  decreaseUndo,
  increaseRedo,
  increaseUndo,
  resetRedo,
  resetUndo,
} from "~store";
import { wrapDegree } from "../utils/wrapDegree";

export type Actions =
  | RemovePageAction
  | RotatePageAction
  | ReorderPageAction
  | SelectPageAction
  | RemoveMultiplePageAction;

export type PageIndex = number;

export type RemovePageAction = {
  type: "removePage";
  pageIndex: PageIndex;
};

export type RemoveMultiplePageAction = {
  type: "removeMultiplePage";
  pageIndexes: PageIndex[];
};

export type RotatePageAction = {
  type: "rotatePage";
  pageIndex: PageIndex;
  degree: number;
};

export type ReorderPageAction = {
  type: "reorderPage";
  fromPageIndex: PageIndex;
  toPageIndex: PageIndex;
};

export type SelectPageAction = {
  type: "selectPage";
  pageIndex: PageIndex;
  select: boolean;
};

export class PdfActions {
  readonly url: string;
  private actions: Actions[];
  private redoActions: Actions[];

  private static cache: Record<string, PdfActions> = {};

  private constructor(url: string) {
    this.url = url;
    this.actions = [];
    this.redoActions = [];
  }

  static createPdfPActions(url: string) {
    if (PdfActions.cache[url]) {
      return PdfActions.cache[url];
    }

    const pdfActions = new PdfActions(url);
    PdfActions.cache[url] = pdfActions;
    return pdfActions;
  }

  removePage(pageIndex: PageIndex, dispatch: AppDispatch, fileIndex: number) {
    this.clearRedoActions(dispatch, fileIndex);

    const newAction: RemovePageAction = {
      type: "removePage",
      pageIndex,
    };

    this.actions.push(newAction);
    this.addUndo(dispatch, fileIndex);
  }

  removeMultiplePage(pageIndexes: PageIndex[], dispatch: AppDispatch, fileIndex: number) {
    this.clearRedoActions(dispatch, fileIndex);

    const newAction: RemoveMultiplePageAction = {
      type: "removeMultiplePage",
      pageIndexes,
    };

    this.actions.push(newAction);
    this.addUndo(dispatch, fileIndex);
  }

  rotatePage(pageIndex: PageIndex, degree: number, dispatch: AppDispatch, fileIndex: number) {
    this.clearRedoActions(dispatch, fileIndex);

    const newAction: RotatePageAction = {
      type: "rotatePage",
      pageIndex,
      degree: wrapDegree(degree),
    };

    this.actions.push(newAction);
    this.addUndo(dispatch, fileIndex);
  }

  reorderPage(
    fromPageIndex: PageIndex,
    toPageIndex: PageIndex,
    dispatch: AppDispatch,
    fileIndex: number
  ) {
    this.clearRedoActions(dispatch, fileIndex);

    const newActions: ReorderPageAction = {
      type: "reorderPage",
      fromPageIndex,
      toPageIndex,
    };

    this.actions.push(newActions);
    this.addUndo(dispatch, fileIndex);
  }

  selectPage(pageIndex: PageIndex, select: boolean, dispatch: AppDispatch, fileIndex: number) {
    this.clearRedoActions(dispatch, fileIndex);

    const newAction: SelectPageAction = {
      type: "selectPage",
      pageIndex,
      select,
    };

    this.actions.push(newAction);
    this.addUndo(dispatch, fileIndex);
  }

  undo(dispatch: AppDispatch, fileIndex: number): Actions {
    const lastAction = this.actions.pop();

    if (lastAction) {
      this.redoActions.push(lastAction);

      dispatch(decreaseUndo({ fileIndex }));
      dispatch(increaseRedo({ fileIndex }));

      return lastAction;
    } else {
      throw new Error("There are no actions left to undo");
    }
  }

  redo(dispatch: AppDispatch, fileIndex: number): Actions {
    const lastAction = this.redoActions.pop();

    if (lastAction) {
      this.actions.push(lastAction);

      dispatch(decreaseRedo({ fileIndex }));
      dispatch(increaseUndo({ fileIndex }));

      return lastAction;
    } else {
      throw new Error("There are no actions left to redo");
    }
  }

  private clearRedoActions(dispatch: AppDispatch, fileIndex: number) {
    this.redoActions = [];
    dispatch(resetRedo({ fileIndex }));
  }

  private addUndo(dispatch: AppDispatch, fileIndex: number) {
    dispatch(increaseUndo({ fileIndex }));
  }

  reset(dispatch: AppDispatch, fileIndex: number) {
    const pastActions = [...this.actions].reverse();

    this.actions = [];
    this.redoActions = [];

    dispatch(resetRedo({ fileIndex }));
    dispatch(resetUndo({ fileIndex }));

    return pastActions;
  }
}
