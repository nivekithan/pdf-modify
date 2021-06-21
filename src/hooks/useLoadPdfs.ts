import { useParams } from "react-router-dom";
import { useAppDispatch } from "./store";
import { useHarperPdf } from "./useHarperPdf";
import { useEffect, useState } from "react";
import { loadNewFiles } from "~store";

export const useLoadPdfs = () => {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<"success" | "loading" | "error">("loading");
  const dispatch = useAppDispatch();
  const harperRes = useHarperPdf(id);

  useEffect(() => {
    if (harperRes.state === "success" && state !== "success") {
      const { files } = harperRes.data;

      dispatch(
        loadNewFiles({
          pdf: files.map((file) => {
            return {
              name: file.fileName,
              indexArr: [],
              initialRotation: [],
              initialUniqueArr: [],
              pages: [],
              redoLength: 0,
              renderArr: [],
              selectLength: 0,
              srcUrl: [],
              undoLength: 0,
              uniqueArr: [],
            };
          }),
          urlArr: files.map((file) => file.url),
        })
      );
      setState("success");
    } else if (harperRes.state === "error" && state !== "error") {
      setState("error");
    }
  }, [dispatch, harperRes.data, harperRes.state, state]);

  return state;
};
