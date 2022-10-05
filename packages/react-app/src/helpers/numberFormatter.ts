export const STILL_LOADING_SIGN = "-";

/**
 *
 * formatWithThousandsSeparators
 *
 * returns number sting with thousand serators
 *
 * toLocalString() not being used for the time being as
 * it is not supported by some browsers, & by default
 * rounds to two decimal places.
 *
 * Current regex being used:
 * https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
 *
 * @param val value ie. 100000000
 * @return string 100,000,000
 **/
export const formatWithThousandsSeparators = (val: number | string, maxDigits: number = 4): string => {
  return Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: maxDigits });
  // line below is probably the cause for the exception on safari: https://stackoverflow.com/questions/51568821/works-in-chrome-but-breaks-in-safari-invalid-regular-expression-invalid-group
  // return val.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,    ",");
  // return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 *
 * formatPercentageTwoDecimals
 *
 * returns number sting with thousand serators
 *
 * @param val number or string (0.4235)
 * @return (0.42%)
 **/
export const formatPercentageTwoDecimals = (val: string | number | null | undefined) => {
  if (val === null || val === undefined) {
    return STILL_LOADING_SIGN;
  }
  return `${Number(val).toFixed(2)}%`;
};

/**
 *
 * formatInteger
 *
 * Description:
 * Takes a number, returns formatted it as a string without decimal points
 *
 */
export const formatInteger = (val: number) => {
  return val.toFixed();
};

export function bytesToHumanReadable(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function convertToAbbreviation(val: number) {
  // thousands, millions, billions etc..
  var s = ["", "K", "M", "B", "T"];

  // dividing the value by 3.
  var sNum = Math.floor(("" + val).length / 3);

  // calculating the precised value.
  // eslint-disable-next-line
  var sVal = parseFloat((sNum != 0 ? val / Math.pow(1000, sNum) : val).toPrecision(3));

  // eslint-disable-next-line
  if (sVal % 1 != 0) {
    //@ts-ignore
    sVal = sVal.toFixed(3);
  }

  // appending the letter to precised val.
  return [sVal, s[sNum]];
}
