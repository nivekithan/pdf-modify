import React from "react";
import ReactDOM from "react-dom";
import { Reducer, useImmerReducer } from "use-immer";
import { useUploadToServer } from "~hooks/useUploadToServer";
import { ReactComponent as ClipBoard } from "~svg/clipboard.svg";
import Loader from "react-loader-spinner";
import { useAppSelector } from "~hooks/store";
import { ReactComponent as ShareIcon } from "~svg/share.svg";

type ShareFilesProps = {
  onClose: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  selectedFileIndex: number;
};

export const ShareFiles = (props: ShareFilesProps) => {
  return ReactDOM.createPortal(<TShareFiles {...props} />, document.body);
};

type CheckBoxState = {
  name: string;
  selected: boolean;
  url: string;
  fileIndex: number;
}[];

type CheckBoxAction = ToggleCheckBox | ClearCheckBox;

type ToggleCheckBox = {
  type: "toggleCheckbox";
  index: number;
};

type ClearCheckBox = {
  type: "clear";
};

const checkBoxReducer: Reducer<CheckBoxState, CheckBoxAction> = (state, action) => {
  if (action.type === "toggleCheckbox") {
    const checkBoxItem = state[action.index];

    if (checkBoxItem) {
      state[action.index].selected = !state[action.index].selected;
      return state;
    }

    throw new Error(
      `There is no item in the index ${action.index}. The total length of array is only ${state.length}`
    );
  } else if (action.type === "clear") {
    for (const item of state) {
      item.selected = false;
    }

    return state;
  }
};

const TShareFiles = ({ onClose, selectedFileIndex }: ShareFilesProps) => {
  const filePdfs = useAppSelector((state) => state.files.pdf);
  const urlArr = useAppSelector((state) => state.files.urlArr);

  const [boxState, dispatchBoxState] = useImmerReducer(
    checkBoxReducer,
    filePdfs.map((file, i) => ({
      selected: i === selectedFileIndex ? true : false,
      url: urlArr[i],
      name: filePdfs[i].name,
      fileIndex: i,
    }))
  );

  const [serveState, load] = useUploadToServer();

  const onClickClearAll = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    dispatchBoxState({ type: "clear" });
  };

  const onClickUploadToServer = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    await load(boxState.filter((state) => state.selected));
  };

  return (
    <div className="h-full w-full fixed left-0 top-0 overflow-auto bg-black bg-opacity-25 grid place-items-center">
      <div className="bg-white flex flex-col gap-y-4 p-4 rounded-md w-[30%] min-w-[200px] max-w-[30%] ">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-700">Select Files</h1>
          <button
            className="bg-red-500 hover:bg-red-700 animate-hover text-white px-2 py-1 text-sm rounded font-semibold"
            disabled={serveState === "loading"}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <p className="text-sm text-gray-">Select Files which you want to share with others</p>
        <form className="max-h-[30vh] overflow-auto">
          {boxState.map((s, i) => (
            <Option
              name={s.name}
              selected={s.selected}
              key={i}
              index={i}
              dispatch={dispatchBoxState}
            />
          ))}
        </form>
        {serveState === "error" ? (
          <p className="text-sm  text-red-700">There has been some error please try again</p>
        ) : typeof serveState !== "string" ? (
          <CopyLink id={serveState.id} />
        ) : null}
        <div className="flex">
          <button
            className="flex-1 bg-white-hover hover:bg-white-hover-darker animate-hover p-2"
            onClick={onClickClearAll}
            disabled={serveState === "loading"}
          >
            CLEAR ALL
          </button>
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-700 animate-hover p-2 text-white"
            onClick={onClickUploadToServer}
            disabled={serveState === "loading"}
          >
            {serveState !== "loading" ? (
              <div className="flex items-center justify-center gap-x-1">
                SHARE
                <ShareIcon
                  style={{ width: "16px", height: "16px" }}
                  className="relative top-0.25"
                />
              </div>
            ) : (
              <Loader type="Oval" width="16px" height="16px" visible color="#FFF" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

type OptionProps = {
  name: string;
  selected: boolean;
  dispatch: (action: CheckBoxAction) => void;
  index: number;
};

const Option = ({ name, selected, dispatch, index }: OptionProps) => {
  const onChangeToggleState = () => {
    dispatch({ type: "toggleCheckbox", index });
  };

  return (
    <label className="flex justify-between items-center p-2 text-md hover:(bg-blue-600 bg-opacity-10) animate-hover rounded font-semibold cursor-pointer">
      {name}
      <input
        type="checkbox"
        className="shadow-none rounded"
        checked={selected}
        onChange={onChangeToggleState}
      />
    </label>
  );
};

const CopyLink = ({ id }: { id: string }) => {
  const onClickCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await navigator.clipboard.writeText(`${location.origin}/${id}`);
  };

  return (
    <div className="flex bg-white-hover rounded border-1 border-gray-300">
      <input
        type="text"
        value={`${location.origin}/${id}`}
        className="text-sm truncate border-none p-2 bg-white-hover flex-1"
        read-only
      />
      <button
        className="p-2 min-w-10 hover:bg-white-hover-darker animate-hover grid place-items-center animate-hover"
        onClick={onClickCopy}
      >
        <ClipBoard width="16px" height="16px" />
      </button>
    </div>
  );
};
