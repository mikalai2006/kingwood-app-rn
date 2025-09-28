export function Clamp(number: number, min: number, max: number) {
  return Math.min(Math.max(number, min), max);
}
export const formatNum = (num: number, digits: number = 0) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((item) => num >= item.value);
  return item
    ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol)
    : "0";
};
// n >= 1000 ? `${(n / 1000).toFixed(toFixedCount)}К` : `${n}`;

export const replaceRegexByArray = function (
  text: string,
  replacements: (string | number)[]
) {
  const regex = /(\%s)/g;
  const _text = text.replace(regex, () => replacements.shift());
  return _text;
};

export const getObjectId = (id?: string) => {
  return id ? (id === "000000000000000000000000" ? "0" : id) : "0";
};

export const groupBy = function (xs: any[], key: string) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] ??= []).push(x);
    return rv;
  }, {});
};

export const getNoun = (
  number: number | undefined,
  one: string,
  two: string,
  five: string
) => {
  if (!number) number = 0;
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return five;
  }
  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }
  return five;
};

export const addStartNull = (num: number | undefined) => {
  return typeof num != "undefined"
    ? num > 9
      ? num.toString()
      : "0" + num
    : num;
};

export function getShortFIO(fio: string | undefined, trimSecondName?: boolean) {
  if (!fio) {
    return "Noname";
  }

  const _arr = fio.split(" ");
  const _newArr = _arr.map((x, index) => (index > 0 ? x[0] + "." : x));
  const _trimArr = trimSecondName
    ? _newArr.slice(_newArr.length - 3, 2)
    : _newArr;
  return _trimArr.join(" ");
}

function padZero(str: string, len?: number) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}

export function invertColor(hex?: string, bw?: boolean) {
  if (!hex) return "black";

  if (!hex.startsWith("#")) return "black";

  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    // throw new Error("Invalid HEX color.");
    hex = hex.slice(0, 6);
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
  }
  return (
    "#" +
    padZero((255 - r).toString(16)) +
    padZero((255 - g).toString(16)) +
    padZero((255 - b).toString(16))
  );
}

export const isExpiredTime = (time: number | undefined) => {
  if (!time) return true;

  const _time = new Date().getTime();
  const timeExp = new Date(time).getTime();
  const diff = timeExp - _time - 5000;

  const isExp = diff <= 0;

  return isExp;
};
