export const cartesian = (...a) => {
  return a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
};

export const randomSample = (array, size) => {
  const shuffled = array.slice(0);
  let i = array.length;
  const minimum = i - size;

  while (i-- > minimum) {
    let index = Math.floor((i + 1) * Math.random());
    let temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }

  return shuffled.slice(minimum);
};
