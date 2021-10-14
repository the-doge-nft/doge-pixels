//@TODO: FIX
import BTCLogo from "../images/coins/BTC.svg"
import DefaultImage from "../images/coins/BTC.svg"
import ETHLogo from "../images/coins/ETH.svg"
import LTCLogo from "../images/coins/LTC.svg"
import BCHLogo from "../images/coins/BCH.svg"
import PAXGLogo from "../images/coins/PAXG.svg"
import BEAMLogo from "../images/coins/BEAM.svg"
import DCRLogo from "../images/coins/DCR.svg"
import EOSLogo from "../images/coins/EOS.svg"
import SCLogo from "../images/coins/SC.svg"
import STORJLogo from "../images/coins/STORJ.svg"
import USDCLogo from "../images/coins/USDC.svg"
import USDTLogo from "../images/coins/USDT.svg"
import XRPLogo from "../images/coins/XRP.svg"
import TUSDLogo from "../images/coins/TUSD.svg";
import OMGLogo from "../images/coins/OMG.svg";
import BCHSVLogo from "../images/coins/BCHSV.svg";
import BCHABCLogo from "../images/coins/BCHABC.svg";
import USDLogo from "../images/coins/USD.svg";
import BRLLogo from "../images/coins/BRL.svg";
import NGNLogo from "../images/coins/NGN.svg";
import INRLogo from "../images/coins/INR.svg";
import CNYLogo from "../images/coins/CNY.svg";
import LINKLogo from "../images/coins/LINK.svg";
import UNILogo from "../images/coins/UNI.svg";
import AAVELogo from "../images/coins/AAVE.svg";
import YFILogo from "../images/coins/YFI.svg";
import COMPLogo from "../images/coins/COMP.svg";
import CRVLogo from "../images/coins/CRV.svg";
import SNXLogo from "../images/coins/SNX.svg";
import ZRXLogo from "../images/coins/ZRX.svg";
import DAILogo from "../images/coins/DAI.svg";
import MKRLogo from "../images/coins/MKR.svg";
import RENLogo from "../images/coins/REN.svg";
import KNCLogo from "../images/coins/KNC.svg";
import UMALogo from "../images/coins/UMA.svg";
import BALLogo from "../images/coins/BAL.svg";
import GRTLogo from "../images/coins/GRT.svg";
import BATLogo from "../images/coins/BAT.svg";
import MANALogo from "../images/coins/MANA.svg";
import ENJLogo from "../images/coins/ENJ.svg";
import AXSLogo from "../images/coins/AXS.png";
import DOGELogo from "../images/coins/DOGE.svg";
import ADALogo from "../images/coins/ADA.svg";
import BRZLogo from "../images/coins/BRZ.svg";
// import DefaultImage from "../images/brands/Escada-Logo.svg"


type FiatCurrency =
    "USD"
    | "BRL"
    | "NGN"
    | "INR"
    | "CNY"

type Alts =
    "UNI"
    | "AAVE"
    | "YFI"
    | "COMP"
    | "CRV"
    | "SNX"
    | "ZRX"
    | "DAI"
    | "MKR"
    | "REN"
    | "KNC"
    | "UMA"
    | "BAL"
    | "GRT"
    | "BAT"
    | "MANA"
    | "ENJ"
    | "LINK"
    | "AXS"
    | "DOGE"
    | "ADA"

type BaseCrypto =
    "BCH"
    | "BCHABC"
    | "BCHSV"
    | "BRT"
    | "BRZ"
    | "BEAM"
    | "BTC"
    | "CBRL"
    | "DCR"
    | "EOS"
    | "ETH"
    | "EXD"
    | "LTC"
    | "OMG"
    | "PAXG"
    | "SC"
    | "STORJ"
    | "TUSD"
    | "USDC"
    | "USDT"
    | "XRP"

export type CurrencyTicker = BaseCrypto | Alts | FiatCurrency

const _baseCryptoCurrency: CurrencyTicker[] = [
    "BCH",
    "BTC",
    "DCR",
    "EOS",
    "ETH",
    "EXD",
    "LTC",
    "PAXG",
    "XRP",
    "USDC",
    "USDT",
    "LINK",
]
export const inCurrency: CurrencyTicker[] = ["INR"]
export const brCurrency: CurrencyTicker[] = ["BRL", "BRT", "BRZ", "CBRL"]
export const remittanceCurrency: CurrencyTicker[] = ["CNY"]
export const unhedgedAltCurrency: CurrencyTicker[] = [
    "UNI",
    "AAVE",
    "YFI",
    "COMP",
    "CRV",
    "SNX",
    "ZRX",
    "DAI",
    "MKR",
    "REN",
    "KNC",
    "UMA",
    "BAL",
    "GRT",
    "BAT",
    "MANA",
    "ENJ",
    "AXS",
    "DOGE",
    "ADA"
]

type CurrencyType = "fiat" | "crypto";
type CurrencyMapType = {
    [K in CurrencyTicker]: {
        image: string | undefined,
        type: CurrencyType,
        decimalPrecision: number,
    }
}

const CRYPTO_PRECISION = 8

export const currencyMap: CurrencyMapType = {
    // BaseCrypto
    BCH: {image: BCHLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    BCHABC: {image: BCHABCLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    BCHSV: {image: BCHSVLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    BEAM: {image: BEAMLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    BRT: {image: DefaultImage, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    BRZ: {image: BRZLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    BTC: {image: BTCLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    CBRL: {image: DefaultImage, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    DCR: {image: DCRLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    EOS: {image: EOSLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    ETH: {image: ETHLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    EXD: {image: DefaultImage, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    LINK: {image: LINKLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    LTC: {image: LTCLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    OMG: {image: OMGLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    PAXG: {image: PAXGLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    SC: {image: SCLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    STORJ: {image: STORJLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    TUSD: {image: TUSDLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    USDC: {image: USDCLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    USDT: {image: USDTLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    XRP: {image: XRPLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},

    // Alts
    UNI: {image: UNILogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    AAVE: {image: AAVELogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    YFI: {image: YFILogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    COMP: {image: COMPLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    CRV: {image: CRVLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    SNX: {image: SNXLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    ZRX: {image: ZRXLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    DAI: {image: DAILogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    MKR: {image: MKRLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    REN: {image: RENLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    KNC: {image: KNCLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    UMA: {image: UMALogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    BAL: {image: BALLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    GRT: {image: GRTLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    BAT: {image: BATLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    MANA: {image: MANALogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    ENJ: {image: ENJLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    AXS: {image: AXSLogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    DOGE: {image: DOGELogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},
    ADA: {image: ADALogo, type: "crypto", decimalPrecision: CRYPTO_PRECISION},

    // Fiat
    BRL: {image: BRLLogo, type: "fiat", decimalPrecision: 2},
    NGN: {image: NGNLogo, type: "fiat", decimalPrecision: 0},
    USD: {image: USDLogo, type: "fiat", decimalPrecision: 2},
    INR: {image: INRLogo, type: "fiat", decimalPrecision: 0},
    CNY: {image: CNYLogo, type: "fiat", decimalPrecision: 2},
}

const sortByCurrencyCompare = (currencyTickerA: CurrencyTicker, currencyTickerB: CurrencyTicker, sortFirst: CurrencyType) => {
    const atype = currencyMap[currencyTickerA]?.type;
    const btype = currencyMap[currencyTickerB]?.type;
    if (btype == atype) {
        if (currencyTickerA > currencyTickerB) {
            return 1
        } else {
            return -1
        }
    } else if (atype == sortFirst) {
        return -1;
    } else if (btype == sortFirst) {
        return 1;
    } else {
        return 0
    }
}

/**
 * Returns an array of objects sorted by their currency type
 * @param arr array of objects containing a currency key
 * @param sortPref string indicating type of currency to place first in arr
 */
export function sortByCurrencyType<T extends { currency: CurrencyTicker }>(arr: T[], sortFirst: CurrencyType): T[] {
    return arr.sort((a, b) => {
        return sortByCurrencyCompare(a.currency, b.currency, sortFirst);
    });
}

export const sortCurrencyArrayByType = (currencyArray: CurrencyTicker[], sortFirst: CurrencyType) => {
    return currencyArray.sort((a, b) => {
        return sortByCurrencyCompare(a, b, sortFirst);
    })
}

export const getCurrencyImageSafe = (currency: CurrencyTicker) => {
    const image = currencyMap[currency]?.image
    if (!image) {
        return DefaultImage
    }
    return image
}

export const isCurrencyTicker = (ticker: string) => {
    return Object.keys(currencyMap).includes(ticker);
}
export const isFiat = (ticker: string) => {
    return currencyMap[ticker as CurrencyTicker]?.type === "fiat"
}
export const isCrypto = (ticker: string) => {
    return currencyMap[ticker as CurrencyTicker]?.type === "crypto"
}
export const commonCurrencies = _baseCryptoCurrency.concat(unhedgedAltCurrency).concat(["USD"])
export const adminCurrencies = commonCurrencies.concat(inCurrency).concat(brCurrency).concat(remittanceCurrency)
