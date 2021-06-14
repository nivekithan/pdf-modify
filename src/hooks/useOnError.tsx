import { useState } from "react";

export const useOnError = (): [Error | undefined, (err: Error) => void] => {
  const [error, setError] = useState<Error | undefined>(undefined);

  const onLoadError = (err: Error) => {
    setError(err);
  };

  return [error, onLoadError];
};
