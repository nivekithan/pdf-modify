export const downloadLink = (link: string, name: string) => {
  const downloadAnchor = document.createElement("a");
  downloadAnchor.href = link;
  downloadAnchor.download = name;
  downloadAnchor.click();
};
