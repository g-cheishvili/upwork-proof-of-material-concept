export const memoize = (fn: Function, extractKey?: (args: any[]) => any, respectUndefined = false) => {
  if (extractKey === void 0) {
    return respectUndefined
      ? memoizeWithFirstArgRespectingUndefined(fn)
      : memoizeWithFirstArg(fn);
  }

  return respectUndefined
    ? memoizeWithExtractedKeyRespectingUndefined(fn, extractKey)
    : memoizeWithExtractedKey(fn, extractKey);
};
export const apply = (fn: Function, args: any[], thisArg?: any) => {
  switch (args.length) {
    case 1:
      return fn.call(thisArg, args[0]);

    case 2:
      return fn.call(thisArg, args[0], args[1]);

    case 3:
      return fn.call(thisArg, args[0], args[1]);

    case 4:
      return fn.call(thisArg, args[0], args[1], args[2]);

    case 5:
      return fn.call(thisArg, args[0], args[1], args[2], args[3]);

    default:
      return fn.apply(thisArg, args);
  }
};
const memoizeWithFirstArg = (fn: Function) => {
  const map = new Map();

  return (...args: any[]) => {
    const key = args[0];
    let value = map.get(key);

    if (value !== void 0) {
      return value;
    }

    value = apply(fn, args);
    map.set(key, value);

    return value;
  };
};
const memoizeWithExtractedKey = (fn: Function, extractKey: (args: any[]) => any) => {
  const map = new Map();

  return (...args: any[]) => {
    const key = extractKey(args);
    let value = map.get(key);

    if (value !== void 0) {
      return value;
    }

    value = apply(fn, args);
    map.set(key, value);

    return value;
  };
};
const memoizeWithFirstArgRespectingUndefined = (fn: Function) => {
  const map = new Map();

  return (...args: any[]) => {
    const key = args[0];
    let value = map.get(key);

    if (value !== void 0 || map.has(key)) {
      return value;
    }

    value = apply(fn, args);
    map.set(key, value);

    return value;
  };
};
const memoizeWithExtractedKeyRespectingUndefined = (fn: Function, extractKey: (args: any[]) => any) => {
  const map = new Map();

  return (...args: any[]) => {
    const key = extractKey(args);
    let value = map.get(key);

    if (value !== void 0 || map.has(key)) {
      return value;
    }

    value = apply(fn, args);
    map.set(key, value);

    return value;
  };
};
export const select = memoize((key: string, obj: {}) => {
  const keys = key.split('.');
  const length = keys.length;

  if (length === 1) {
    return obj[key];
  }

  let value = obj;

  for (let i = 0; i < length; ++i) {
    if (!value.hasOwnProperty(keys[i])) {
      value = '';
      break;
    }
    value = value[keys[i]];
  }

  return value;
}, args => args);

function pad(hash, len) {
  while (hash.length < len) {
    hash = '0' + hash;
  }
  return hash;
}

function fold(hash, text) {
  var i;
  var chr;
  var len;
  if (text.length === 0) {
    return hash;
  }
  for (i = 0, len = text.length; i < len; i++) {
    chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash < 0 ? hash * -2 : hash;
}

function foldObject(hash, o, seen) {
  return Object.keys(o).sort().reduce(foldKey, hash);

  function foldKey(hash, key) {
    return foldValue(hash, o[key], key, seen);
  }
}

function foldValue(input, value, key, seen) {
  var hash = fold(fold(fold(input, key), toString(value)), typeof value);
  if (value === null) {
    return fold(hash, 'null');
  }
  if (value === undefined) {
    return fold(hash, 'undefined');
  }
  if (typeof value === 'object') {
    if (seen.indexOf(value) !== -1) {
      return fold(hash, '[Circular]' + key);
    }
    seen.push(value);
    return foldObject(hash, value, seen);
  }
  return fold(hash, value.toString());
}

function toString(o) {
  return Object.prototype.toString.call(o);
}

export function sum(o: any): string {
  return pad(foldValue(0, o, '', []).toString(16), 8);
}
