export const urlToArrayBuffer = async (url: string) => {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();

  return arrayBuffer;
};
