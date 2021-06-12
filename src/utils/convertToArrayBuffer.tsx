export const convertToArrayBuffer = (file: File) => {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const fileReader = new FileReader();

    const onError = (e: ProgressEvent<FileReader>) => {
      console.log(e.target?.error);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      reject(e.target!.error!);
    };

    const onLoad = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;

      if (!(result instanceof ArrayBuffer)) {
        throw new Error("The data should only be loaded as Array Buffer");
      }

      resolve(result);
    };

    fileReader.onerror = onError;
    fileReader.onload = onLoad;

    fileReader.readAsArrayBuffer(file);
  });
};
