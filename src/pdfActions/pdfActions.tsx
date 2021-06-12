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

  undo() {
    const lastAction = this.actions.pop();

    if (lastAction) {
      this.redoActions.push(lastAction);
    } else {
      throw new Error("There are no actions left to undo");
    }
  }

  redo() {
    const lastAction = this.redoActions.pop();

    if (lastAction) {
      this.actions.push(lastAction);
    } else {
      throw new Error("There are no actions left to redo");
    }
  }

  async getNewPdfLink() {
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
