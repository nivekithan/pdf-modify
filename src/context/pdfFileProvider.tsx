import React, { useContext } from "react";
import { useMemo } from "react";

const fileName = React.createContext<string | null>(null);

const fileUrl = React.createContext<string | null>(null);

const fileIndex = React.createContext<number | null>(null);

export type PdfFileProviderProps = {
  children: React.ReactNode;
  name: string;
  url: string;
  index: number;
};

export const PdfFileProvider = ({ children, name, url, index }: PdfFileProviderProps) => {
  return (
    <fileName.Provider value={name}>
      <fileIndex.Provider value={index}>
        <fileUrl.Provider value={url}>{children}</fileUrl.Provider>
      </fileIndex.Provider>
    </fileName.Provider>
  );
};

export const usePdfFile = () => {
  const name = useContext(fileName);
  const url = useContext(fileUrl);
  const index = useContext(fileIndex);

  if (name === null || url === null || index === null) {
    throw new Error("Use hook usePdfFile inside PdfFileProvider tree");
  }

  return useMemo(() => ({ name, url, index }), [name, url, index]);
};
