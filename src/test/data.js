import invariant from "invariant";

export const cartesian = (...a) => {
  return a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
};

export const randomSample = (array, size) => {
  invariant(array != null, "array argument is required");
  invariant(size != null, "size argument is required");

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

export const draw = function* (count, source) {
  invariant(count != null, "count argument is required");
  invariant(source != null, "source argument is required");

  const iterator = source[Symbol.iterator]();
  while (count-- > 0) {
    yield iterator.next().value;
  }
};

export const arrayOf = function* (source, { minLength, maxLength } = {}) {
  invariant(source != null, "source argument is required");

  if (minLength === undefined) {
    minLength = 0;
  }
  if (maxLength === undefined) {
    maxLength = 16;
  }

  invariant(minLength >= 0, "minLength may not be less than 0");
  invariant(maxLength >= 0, "maxLength may not be less than 0");
  invariant(
    minLength <= maxLength,
    "minLength may not be greater than maxLength"
  );

  while (true) {
    let length =
      Math.floor(Math.random() * (maxLength - minLength)) + minLength;
    yield Array.from(draw(length, source));
  }
};

// Text

export const alphabet_ascii_uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const alphabet_ascii_lowercase = "abcdefghijklmnopqrstuvwxyz";
export const alphabet_ascii_letters =
  alphabet_ascii_uppercase + alphabet_ascii_lowercase;
export const alphabet_digits = "0123456789";
export const alphabet_alphanumeric = alphabet_ascii_letters + alphabet_digits;
export const alphabet_puctuation = "!\"#$%&'()*+,-./:;<=>?@[]^_`{|}~.";
export const alphabet_whitespace = " \t";
export const alphabet_printable =
  alphabet_ascii_letters +
  alphabet_digits +
  alphabet_puctuation +
  alphabet_whitespace;

export const text = function* ({ alphabet, minLength, maxLength } = {}) {
  if (alphabet === undefined) {
    alphabet = alphabet_printable;
  }
  if (minLength === undefined) {
    minLength = 0;
  }
  if (maxLength === undefined) {
    maxLength = 255;
  }

  invariant(minLength >= 0, "minLength may not be less than 0");
  invariant(maxLength >= 0, "maxLength may not be less than 0");
  invariant(
    minLength <= maxLength,
    "minLength may not be greater than maxLength"
  );

  while (true) {
    let length =
      Math.floor(Math.random() * (maxLength - minLength)) + minLength;
    let result = "";

    while (length-- > 0) {
      result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    yield result;
  }
};
