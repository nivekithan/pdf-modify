import { PDFDocument, degrees } from "pdf-lib";

type Actions = RemovePageAction | RotatePageAction;

type RemovePageAction = {
  type: "removePage";
  pageIndex: number;
};

type RotatePageAction = {
  type: "rotatePage";
  pageIndex: number;
  degree: number;
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

  removePage(pageIndex: number) {
    this.clearRedoActions();

    const newAction: RemovePageAction = {
      type: "removePage",
      pageIndex,
    };

    this.actions.push(newAction);
  }

  rotatePage(pageIndex: number, degree: number) {
    this.clearRedoActions();

    const newAction: RotatePageAction = {
      type: "rotatePage",
      pageIndex,
      degree,
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

  canReset() {
    return this.actions.length !== 0;
  }

  reset() {
    const pastActions = [...this.actions].reverse();

    if (pastActions.length !== 0) {
      this.actions = [];
      return pastActions;
    } else {
      throw new Error("There is no actions left to reset");
    }
  }

  async getNewPdfLink() {
    if (this.actions.length === 0) {
      return this.url;
    }

    const res = await fetch(this.url);
    const currArrayBuffer = await res.arrayBuffer();
    const currPdf = await PDFDocument.load(currArrayBuffer);

    this.actions.forEach((action) => {
      switch (action.type) {
        case "removePage":
          currPdf.removePage(action.pageIndex);
          break;
        case "rotatePage":
          currPdf.getPage(action.pageIndex).setRotation(degrees(action.degree));
          break;
      }
    });

    const newUint8Array = await currPdf.save();
    return URL.createObjectURL(new Blob([newUint8Array.buffer], { type: "application/pdf" }));
  }

  private clearRedoActions() {
    this.redoActions = [];
  }
}
