import { PDFDocument } from "pdf-lib";

type Actions = RemovePageAction;

type RemovePageAction = {
  type: "removePage";
  pageIndex: number;
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
      }
    });

    const newUint8Array = await currPdf.save();
    return URL.createObjectURL(new Blob([newUint8Array.buffer], { type: "application/pdf" }));
  }

  private clearRedoActions() {
    this.redoActions = [];
  }
}
