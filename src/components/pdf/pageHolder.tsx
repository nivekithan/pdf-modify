import React from "react";

type PageHolderProps = {
  children: React.ReactNode;
};

export const PageHolder = ({ children }: PageHolderProps) => {
  return (
    <div className="border-2 border-gray-300 max-h-[400px] overflow-auto">
      <div className="mb-20">{children}</div>
    </div>
  );
};
