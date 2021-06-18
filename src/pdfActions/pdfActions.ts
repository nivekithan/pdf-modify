import { PDFDocument, degrees } from "pdf-lib";
import { urlToArrayBuffer } from "../utils/urlToArrayBuffer";
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

  constructor(url: string) {
    this.url = url;
    this.actions = [];
    this.redoActions = [];
  }

  removePage(pageIndex: PageIndex) {
    this.clearRedoActions();

    const newAction: RemovePageAction = {
      type: "removePage",
      pageIndex,
    };

    this.actions.push(newAction);
  }

  removeMultiplePage(pageIndexes: PageIndex[]) {
    this.clearRedoActions();

    const newAction: RemoveMultiplePageAction = {
      type: "removeMultiplePage",
      pageIndexes,
    };

    this.actions.push(newAction);
  }

  rotatePage(pageIndex: PageIndex, degree: number) {
    this.clearRedoActions();

    const newAction: RotatePageAction = {
      type: "rotatePage",
      pageIndex,
      degree: wrapDegree(degree),
    };

    this.actions.push(newAction);
  }

  reorderPage(fromPageIndex: PageIndex, toPageIndex: PageIndex) {
    this.clearRedoActions();

    const newActions: ReorderPageAction = {
      type: "reorderPage",
      fromPageIndex,
      toPageIndex,
    };

    this.actions.push(newActions);
  }

  selectPage(pageIndex: PageIndex, select: boolean) {
    this.clearRedoActions();

    const newAction: SelectPageAction = {
      type: "selectPage",
      pageIndex,
      select,
    };

    this.actions.push(newAction);
  }

  canUndo() {
    return this.actions.length !== 0;
  }

  undo(): Actions {
    const lastAction = this.actions.pop();

    if (lastAction) {
      this.redoActions.push(lastAction);
      return lastAction;
    } else {
      throw new Error("There are no actions left to undo");
    }
  }

  canRedo() {
    return this.redoActions.length !== 0;
  }

  redo(): Actions {
    const lastAction = this.redoActions.pop();

    if (lastAction) {
      this.actions.push(lastAction);
      return lastAction;
    } else {
      throw new Error("There are no actions left to redo");
    }
  }

  private clearRedoActions() {
    this.redoActions = [];
  }

  canReset() {
    return this.canRedo() || this.canUndo();
  }

  reset() {
    if (!this.canReset()) {
      throw new Error("There are no actions left to reset");
    }

    const pastActions = [...this.actions].reverse();

    this.actions = [];
    this.redoActions = [];

    return pastActions;
  }

  async getNewPdfLink() {
    return this.url;
  }

  private reorder(pdf: PDFDocument, fromPageIndex: number, toPageIndex: number) {
    const fromPage = pdf.getPage(fromPageIndex);
    pdf.removePage(fromPageIndex);
    pdf.insertPage(toPageIndex, fromPage);
  }
}
