export const arrayInsertMutate = <T>(arr: T[], value: T, index: number) => {
  arr.splice(index, 0, value);
  return arr;
};
