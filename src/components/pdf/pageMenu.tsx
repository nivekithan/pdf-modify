import React from "react";

type PageMenuProps = {
  onApplyChanges: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

  // Undo options
  onUndo: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disableUndo: boolean;

  // Redo options
  onRedo: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disableRedo: boolean;

  // Reset Actions
  onReset: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disableReset: boolean;
};

export const PageMenu = ({
  onApplyChanges,
  onRedo,
  onUndo,
  disableRedo,
  disableUndo,
  onReset,
  disableReset,
}: PageMenuProps) => {
  return (
    <div className="border-2 border-gray-300 border-t-0 flex justify-between p-6">
      <div className="flex gap-x-4">
        <button
          className={`bg-blue-600  text-white text-md font-semibold px-4 py-2 rounded-md ${
            disableUndo ? "opacity-50" : "hover:bg-blue-800"
          }`}
          onClick={onUndo}
          disabled={disableUndo}
        >
          Undo
        </button>
        <button
          className={`bg-blue-600  text-white text-md font-semibold px-4 py-2 rounded-md ${
            disableRedo ? "opacity-50" : "hover:bg-blue-800"
          }`}
          onClick={onRedo}
          disabled={disableRedo}
        >
          Redo
        </button>
      </div>
      <div className="flex items-center gap-x-4">
        <button
          className={`bg-red-600  text-white text-sm font-semibold px-4 py-2 rounded-md ${
            disableReset ? "opacity-50" : "hover:bg-red-700"
          }`}
          onClick={onReset}
        >
          Reset Changes
        </button>
        <button
          className="bg-green-600 hover:bg-green-800 text-white text-md font-semibold px-6 py-3 rounded-md"
          onClick={onApplyChanges}
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};