import { PDFDocument } from "pdf-lib";

type Actions = RemovePageAction;

type RemovePageAction = {
  type: "removePage";
  pageIndex: number;
};

export class PdfActions {
  readonly url: string;
  private actions: Actions[];

  constructor(url: string) {
    this.url = url;
    this.actions = [];
  }

  removePage(pageIndex: number) {
    const newAction: RemovePageAction = {
      type: "removePage",
      pageIndex,
    };

    this.actions.push(newAction);
  }

  async getNewPdf() {
    console.log({ curr: this.url });
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
    const newUrl = URL.createObjectURL(
      new Blob([newUint8Array.buffer], { type: "application/pdf" })
    );
    const downloadLinK = document.createElement("a");
    downloadLinK.href = newUrl;
    downloadLinK.download = "pdf-modify.pdf";
    downloadLinK.click();
    URL.revokeObjectURL(newUrl);
  }
}
