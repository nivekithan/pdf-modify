import React from "react";
import Loader from "react-loader-spinner";

export const PdfLoading = () => {
  return (
    <div className="grid place-items-center mt-20">
      <Loader type="Oval" width="120px" height="120px" visible color={"rgba(37, 99, 235)"} />;
    </div>
  );
};
