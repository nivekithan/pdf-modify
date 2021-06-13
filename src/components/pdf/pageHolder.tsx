import React from "react";

type PageHolderProps = {
  children: React.ReactNode;
};

export const PageHolder = ({ children }: PageHolderProps) => {
  return <div className="border-2 border-gray-300 ">{children}</div>;
};
