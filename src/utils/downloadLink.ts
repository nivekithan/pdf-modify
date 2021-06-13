export const downloadLink = (link: string, name = "pdf-modify.pdf") => {
  const downloadAnchor = document.createElement("a");
  downloadAnchor.href = link;
  downloadAnchor.download = name;
  downloadAnchor.click();
};
