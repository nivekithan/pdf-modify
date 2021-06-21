import { urlToFiles } from "~utils/urlToFiles";
import { useEffect, useCallback, useState, useRef } from "react";
import { supabase } from "src/supabase";
import { nanoid } from "nanoid";
import { applyChangesToPdf } from "~utils/applyChangesToPdf";
import { useAppSelector } from "./store";
import { PdfPage } from "~store";

type loadProps = {
  name: string;
  url: string;
  fileIndex: number;
}[];

export const useUploadToServer = (): [
  "loading" | "error" | "stale" | { state: "success"; id: string },
  (props: loadProps) => Promise<void>
] => {
  const mount = useRef(true);

  const curFiles = useAppSelector((state) => state.files.pdf);

  const [currState, setCurrState] = useState<
    "loading" | "error" | "stale" | { state: "success"; id: string }
  >("stale");

  const load = useCallback(
    async (props: loadProps) => {
      try {
        mount.current && setCurrState("loading");

        const storageUrls = await Promise.all(
          props.map((info) =>
            uploadToStorage(
              { name: info.name, url: info.url },
              {
                indexArr: curFiles[info.fileIndex].indexArr,
                renderArr: curFiles[info.fileIndex].renderArr,
                srcArr: curFiles[info.fileIndex].srcUrl,
                pages: curFiles[info.fileIndex].pages,
              }
            )
          )
        );

        const storageUrlWithFileName = storageUrls.map((url, i) => {
          return {
            url,
            fileName: props[i].name,
          };
        });

        const id = await uploadToHarper(storageUrlWithFileName);

        mount.current && setCurrState({ state: "success", id });
      } catch (err) {
        mount.current && setCurrState("error");
      }
    },
    [curFiles]
  );

  useEffect(() => {
    mount.current = true;

    return () => {
      mount.current = false;
    };
  }, []);

  return [currState, load];
};

const uploadFileToStorage = async (file: File) => {
  const res = await supabase.storage.from("test-hack").upload(`${nanoid()}.pdf`, file);

  if (!res.data) {
    throw new Error("There is something wrong in uploading files to supabase");
  }

  const key = res.data.Key;
  const publicUrl = `${import.meta.env.VITE_DB_URL}/storage/v1/object/public/test-hack/${
    key.split("/")[1]
  }`;

  return publicUrl;
};

const uploadToHarper = async (props: { url: string; fileName: string }[]) => {
  const headers = new Headers();
  headers.append("Content-type", "application/json");
  headers.append(
    "Authorization",
    `Basic ${btoa(`${import.meta.env.VITE_HARPER_NAME}:${import.meta.env.VITE_HARPER_PASSWORD}`)}`
  );

  const raw = JSON.stringify({
    operation: "insert",
    schema: "dev",
    table: "pdfs",
    records: [
      {
        count: props.length,
        files: props,
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: raw,
  };

  const harperRes = await fetch(import.meta.env.VITE_HARPER_URL, requestOptions);

  if (harperRes.ok) {
    const { inserted_hashes } = await harperRes.json();
    return inserted_hashes[0];
  }

  throw new Error("Something is gone wrong");
};

type FileInfo = {
  url: string;
  name: string;
};

type ChangedPdfFiles = {
  pages: PdfPage[];
  renderArr: boolean[];
  indexArr: number[];
  srcArr: (string | undefined)[];
};

const uploadToStorage = async (info: FileInfo, updatedFile: ChangedPdfFiles) => {
  const updatedUrl = await applyChangesToPdf(info.url, updatedFile);
  const file = await urlToFiles(updatedUrl, info.name);
  const storageUrl = await uploadFileToStorage(file);

  return storageUrl;
};
