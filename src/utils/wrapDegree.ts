// https://github.com/jamestalmage/normalize-range/blob/5e2cc2966a8728ff33f31f3425e157052b0d8244/index.js#L11
const wrapRange = (min: number, max: number, value: number) => {
  const maxLessMin = max - min;

  return ((((value - min) % maxLessMin) + maxLessMin) % maxLessMin) + min;
};

export const wrapDegree = (value: number) => {
  return wrapRange(0, 360, value);
};
