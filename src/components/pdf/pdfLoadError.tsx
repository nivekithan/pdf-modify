import React from "react";
import { ReactComponent as LoadError } from "../../svg/load-error.svg";

export const PdfLoadError = () => {
  return (
    <div className="flex gap-x-15 items-center mx-30">
      <div>
        <LoadError width="280px" height="280px" />
      </div>
      <div className="flex flex-col gap-y-8 ">
        <p className="text-xl text-center font-semibold">Sorry, unable to Load this file</p>
        <div>
          <button className="bg-blue-600 hover:bg-blue-800 px-3 py-2 text-white rounded-md">
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};
