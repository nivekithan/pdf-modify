export const arrayMoveMutate = <T>(arr: T[], from: number, to: number) => {
  const [item] = arr.splice(from, 1);
  arr.splice(to, 0, item);
};
