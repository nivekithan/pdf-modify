// NEEDS A BETTER NAME

export const fallbackIfUndefined = <Value>(firstValue: Value | undefined, default_: Value) => {
  if (firstValue === undefined) {
    return default_;
  } else {
    return firstValue;
  }
};
