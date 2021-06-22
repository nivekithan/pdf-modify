import React from "react";
import { ReactComponent as PageUnknown } from "~svg/404.svg";
import { Link } from "react-router-dom";

export const PageNotFound = () => {
  return (
    <main className="grid place-items-center">
      <div className="flex flex-col items-center">
        <PageUnknown width="300px" height="320px" />
        <div className="flex items-center gap-x-6">
          <h4 className="text-3xl font-semibold text-gray-700">
            <span className="text-red-600">Error!</span> Page Not found
          </h4>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-800 text-white px-3 py-2 rounded-md animate-hover"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PageNotFound;
