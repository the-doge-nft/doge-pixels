import { currencyMap, CurrencyTicker, isCrypto, isFiat } from "./currency";

const _currencyFormatters: any = {};
export const STILL_LOADING_SIGN = "-";
/**
 *
 * getCurrencyFormatter
 *
 * generates currency string from number
 * USAGE: currencyFormatter(<currency eg USD>).format(<amount>)
 *
 * @param currency amount ie. 10000
 * @param maxDigits
 * @return currency string ie. $10,000
 **/
export const getCurrencyFormatter = (currency: CurrencyTicker = "USD", maximumFractionDigits?: number) => {
  const key = maximumFractionDigits !== undefined ? `${currency}-${maximumFractionDigits}` : currency;
  if (!_currencyFormatters[key]) {
    _currencyFormatters[key] = new Intl.NumberFormat("en-US", {
      style: "currency",
      minimumFractionDigits: 0,
      currency,
      maximumFractionDigits,
    });
  }
  return _currencyFormatters[key];
};

/**
 *
 * formatUsd
 *
 * TODO: description
 * @param amount
 */
export const formatUsd = (amount: string | number) => {
  return getCurrencyFormatter("USD").format(amount);
};

/**
 *
 * formatUsdSafe
 *
 * TODO: description
 * @param amount
 */
export const formatUsdSafe = (amount: string | number | undefined | null) => {
  if (amount === undefined || amount === null) {
    return STILL_LOADING_SIGN;
  }
  return formatUsd(amount);
};

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
export const formatWithThousandsSeparators = (val: number | string, maxDigits: number = 8): string => {
  return Number(val).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: maxDigits });
  // line below is probably the cause for the exception on safari: https://stackoverflow.com/questions/51568821/works-in-chrome-but-breaks-in-safari-invalid-regular-expression-invalid-group
  // return val.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,    ",");
  // return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 *
 * formatToCurrency
 *
 * returns string with default currency formatting applied for fiat
 * and crypto currencies. Currency precision is controlled by currencyMap.
 * Optional parameter maxDigits can be used to override default currency precision.
 *
 * @param currency: CurrencyTicker ("USD", "BRL", "BTC")
 * @param value: (100, "234928.43234", 1.00948376
 * @param maxDigits (0, 2)
 * @return ("$100", "R$234,928.43", "1.00948376")
 **/
export const formatToCurrency = (currency: CurrencyTicker, amount: string | number, maxDigits?: number): string => {
  const currencyConfig = currencyMap[currency];
  const digits = maxDigits !== undefined ? maxDigits : currencyConfig?.decimalPrecision;

  let amountFormatted;
  if (digits !== undefined) {
    if (isFiat(currency)) {
      amountFormatted = getCurrencyFormatter(currency, digits).format(amount);
    } else if (isCrypto(currency)) {
      amountFormatted = formatWithThousandsSeparators(amount, digits);
    } else if (maxDigits !== undefined) {
      amountFormatted = formatWithThousandsSeparators(amount, digits);
    }
  } else {
    amountFormatted = formatWithThousandsSeparators(amount);
  }
  return amountFormatted;
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
