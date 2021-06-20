import { useHarperUser } from "~context/harperRoleProvider";
import { useState, useEffect } from "react";

type HarperSuccessState = {
  state: "success";
  data: {
    count: number;
    files: {
      url: string;
      fileName: string;
    }[];
  };
  error: undefined;
};

type HarperErrorState = {
  state: "error";
  data: undefined;
  error: string;
};

type HarperLoadingState = {
  state: "loading";
  data: undefined;
  error: undefined;
};

type HarperStaleState = {
  state: "stale";
  data: undefined;
  error: undefined;
};

type HarperState = HarperErrorState | HarperLoadingState | HarperSuccessState | HarperStaleState;

const url = import.meta.env.VITE_HARPER_URL;

export const useHarperPdf = (id: string) => {
  const { password, userName } = useHarperUser();
  const [harperState, setHarperState] = useState<HarperState>({
    data: undefined,
    error: undefined,
    state: "stale",
  });

  useEffect(() => {
    let mount = true;

    const raw = JSON.stringify({
      operation: "search_by_value",
      schema: "dev",
      table: "pdfs",
      search_attribute: "id",
      search_value: id,
      get_attributes: "*",
    });

    const headers = new Headers();
    headers.append("Content-type", "application/json");
    headers.append("Authorization", `Basic ${btoa(`${userName}:${password}`)} `);

    const control = new AbortController();

    (async () => {
      try {
        const getPdfUrls = async () => {
          const request = await fetch(url, {
            method: "POST",
            body: raw,
            signal: control.signal,
            headers,
          });

          const json = await request.json();
          const response = json.body || json;

          if (response.error) {
            throw new Error(response.message);
          }

          return response;
        };

        mount && setHarperState({ state: "loading", data: undefined, error: undefined });
        const response = await getPdfUrls();

        if (response.length !== 1) {
          throw new Error("There is something wrong. Please retry again");
        }

        mount && setHarperState({ state: "success", data: response[0], error: undefined });
      } catch (err) {
        mount && setHarperState({ state: "error", data: undefined, error: err.message });
      }
    })();

    return () => {
      mount = false;
      control.abort();
    };
  }, [id, password, userName]);

  return harperState;
};
