import React, { useRef } from "react";
import { usePdfActions } from "~context/pdfActionProvider";
import { usePdfFile } from "~context/pdfFileProvider";
import { useAppDispatch, useAppSelector } from "~hooks/store";
import { setSelectPageInFile } from "~store";

type CheckboxProps = {
  renderIndex: number;
};

export const Checkbox = ({ renderIndex }: CheckboxProps) => {
  const { index: fileIndex } = usePdfFile();
  const checkboxRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const pdfAction = usePdfActions();

  const selected = useAppSelector(
    (state) => state.files.pdf[fileIndex].pages[renderIndex].selected
  );

  const onToggleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.currentTarget.checked;

    pdfAction.selectPage(renderIndex, selected, dispatch, fileIndex);
    dispatch(setSelectPageInFile({ fileIndex, renderIndex, select: selected }));
  };

  return (
    <form className="absolute top-2 left-2">
      <input
        type="checkbox"
        className="w-6 h-6 focus:shadow-none rounded-sm "
        checked={selected}
        onChange={onToggleSelect}
        ref={checkboxRef}
      />
    </form>
  );
};
