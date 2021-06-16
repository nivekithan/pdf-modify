import { useImmerReducer, Reducer } from "use-immer";
import { arrayMoveMutate } from "../utils/arrayMoveMutate";
import { wrapDegree } from "../utils/wrapDegree";

export type PageInfo = {
  index: number;
  render: boolean;
  rotation: number;
  selected: boolean;
};

type PageListsActions =
  | PageItemCreateAction
  | PageListsResetAction
  | PageListsRemoveAction
  | PageListsRotateAction
  | PageListsReorderAction
  | PageListsSetSelectAction;

type PageItemCreateAction = {
  type: "create";
  totalPageNumber: number;
};

type PageListsResetAction = {
  type: "reset";
};

type PageListsRemoveAction = {
  type: "removePage";
  renderIndex: number;
  reverse?: boolean;
};

type PageListsRotateAction = {
  type: "rotatePage";
  renderIndex: number;
  rotate: number;
  reverse?: boolean;
};

type PageListsReorderAction = {
  type: "reorderPage";
  fromRenderIndex: number;
  toRenderIndex: number;
  reverse?: boolean;
};

type PageListsSetSelectAction = {
  type: "setSelectPage";
  renderIndex: number;
  select: boolean;
  reverse?: boolean;
};

const pageItemsReducer: Reducer<PageInfo[] | undefined, PageListsActions> = (
  pageItems,
  actions
) => {
  if (actions.type === "create") {
    return Array(actions.totalPageNumber)
      .fill(0)
      .map((_, i) => ({ render: true, rotation: 0, index: i, selected: false }));
  }

  if (pageItems === undefined) {
    throw new Error("The pageItems is undefined, use PageItemCreateAction to initialize");
  }

  if (actions.type === "reset") {
    return Array(pageItems.length)
      .fill(0)
      .map((_, i) => ({ render: true, rotation: 0, index: i, selected: false }));
  }

  if (!actions.reverse) {
    switch (actions.type) {
      case "removePage":
        pageItems[actions.renderIndex].render = false;
        return pageItems;
      case "rotatePage":
        pageItems[actions.renderIndex].rotation = wrapDegree(
          pageItems[actions.renderIndex].rotation + actions.rotate
        );
        return pageItems;
      case "reorderPage":
        arrayMoveMutate(pageItems, actions.fromRenderIndex, actions.toRenderIndex);
        return pageItems;
      case "setSelectPage":
        pageItems[actions.renderIndex].selected = actions.select;
        return pageItems;
    }
  }

  switch (actions.type) {
    case "removePage":
      pageItems[actions.renderIndex].render = true;
      return pageItems;
    case "rotatePage":
      pageItems[actions.renderIndex].rotation = wrapDegree(
        pageItems[actions.renderIndex].rotation - actions.rotate
      );
      return pageItems;
    case "reorderPage":
      arrayMoveMutate(pageItems, actions.toRenderIndex, actions.fromRenderIndex);
      return pageItems;
    case "setSelectPage":
      pageItems[actions.renderIndex].selected = !actions.select;
      return pageItems;
  }
};

export const usePageLists = () => {
  return useImmerReducer(pageItemsReducer, undefined);
};
