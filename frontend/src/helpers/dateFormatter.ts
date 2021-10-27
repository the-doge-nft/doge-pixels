/**
 *
 * getYMDToday
 *
 * Returns today in YYYY-MM-DD format
 *
 * @return string 2020-10-02
 */
import {KeysOf} from "./interfaces";
import {ObjectKeys} from "./objects";

export type HumanFriendlyTimespan = '6h' | '12h' | '24h' | '7d' | '31d';

/**
 * changeTimezone
 *
 * Description:
 * Get Date object transformed to target timezone
 */
function changeTimezone(localDate: Date, targetTz: string) {
    const tzDate = new Date(localDate.toLocaleString('en-US', {
        timeZone: targetTz
    }));
    const diff = localDate.getTime() - tzDate.getTime();
    return new Date(localDate.getTime() - diff);
}


export const getApiFormatToday = () => {
    return getApiFormatDate(new Date());
}

/**
 * getNYToday
 *
 * Description:
 * Get Date object for today in NY tz
 */
export const getNYToday = () => {
    return changeTimezone(new Date(), "America/New_York")
}

export const getNYTodayApiFormat = () => {
    return getApiFormatDate(getNYToday());
}

/**
 *
 * getApiFormatDateUTC
 *
 * Returns date in API-supported format in UTC (ISO 8601)
 * January - 01
 *
 * @return string 2020-12-04T19:37:40.700Z
 */
export const getApiFormatDateUTC = (d: Date) => {
    return d.toISOString();
}

/**
 *
 * getApiFormatDate
 *
 * Returns date in API-supported format in local timezone, that is with dashes
 * January - 01
 *
 * @return string 2020-10-02
 */
export const getApiFormatDate = (d: Date) => {
    return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`
}

/**
 *
 * getApiFormatDate
 *
 * Returns datetime in API-supported format, that is with dashes
 * January - 01
 *
 * @return string 2020-10-02 21:33:45
 */
interface Time {
    hours: number | string,
    minutes: number | string,
    seconds: number | string
}

export const getApiFormatDateTime = (d: Date, withSeconds = true) => {

    const time: Time = {
        hours: d.getHours(),
        minutes: d.getMinutes(),
        seconds: d.getSeconds()
    }
    // 0 padding not added by default
    ObjectKeys(time).forEach((key: KeysOf<Time>) => {
        if (time[key] < 10) {
            time[key] = "0" + time[key]
        }
    })
    return getApiFormatDate(d) + ' ' + time.hours + ":" + time.minutes + (withSeconds ? ":" + time.seconds : "");
}


/**
 *
 * getYMDate
 *
 * Returns a date as a string value appropriate to the host environment's current locale.
 * Result depends on UA settings
 *
 * @return string
 */
export const formatDate = (d: Date) => {
    return d.toLocaleDateString();
}


/**
 *
 * getYMDHMSDate
 *
 * Returns a datetime as a string value appropriate to the host environment's current locale.
 * Result depends on UA settings
 *
 * @return string
 */
export const formatDateTime = (d: Date) => {
    return d.toLocaleDateString() + " " + d.toLocaleTimeString()
}


/**
 *
 * getYMDHMSDate
 *
 * Returns a datetime as a string value appropriate to the host environment's current locale.
 * Result depends on UA settings
 *
 * @return string
 */
export const formatDateTimeSafe = (d: Date | null) => {
    return d ? formatDateTime(d) : "-"
}

/**
 *
 * getLocaleTimezone
 *
 * Description:
 * returns locale timezone string
 */
export const getLocaleTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
/**
 *
 * @param timespan
 */
export const humanFriendlyTimespanToMs = (timespan: HumanFriendlyTimespan): number => {
    const oneHourInMs = (60 * 60 * 1000);
    const oneDayInMs = (24 * 60 * 60 * 1000);
    const matches = /^(\d{1,2})([hd])/gm.exec(timespan);
    if (matches!.length != 3) {
        throw new Error("Inproper format of timespan passed to formatter: " + timespan);
    }
    const [, qty, modifier]: any = matches;
    if (modifier === 'h') {
        return qty * oneHourInMs;
    }
    if (modifier === 'd') {
        return qty * oneDayInMs;
    }
    throw new Error("This should never happen");
}


/**
 *
 * @param ms
 */
export const msToHumanReadable = (ms: number): string => {
    let callDurationTime = '';
    if (ms > 0) {
        let tempDuration = Math.ceil(ms / 1000);
        let hour = parseInt(tempDuration / 3600 + "");
        let min = parseInt((tempDuration - (hour * 3600)) / 60 + "");
        let sec = tempDuration - (hour * 3600) - (min * 60);
        if (hour > 0) {
            callDurationTime = hour + 'h ';
        }
        if (min > 0) {
            callDurationTime += (min + 'm ');
        }
        callDurationTime += (sec + 's');
    } else {
        callDurationTime = '0s';
    }
    return callDurationTime;
    // return hours + ":" + minutes + ":" + seconds;//+ "." + milliseconds;
}


/**
 * getFirstMondayBefore
 *
 * Description:
 * Returns date that's first monday before date, if date is not already monday
 * @param date
 */
export function getFirstMondayBefore(date: Date) {
    const ret = new Date(date.getTime());
    // default sunday to 7
    const day = ret.getDay() || 7;
    if (day !== 1)
        ret.setHours(-24 * (day - 1));
    return ret;
}

/**
 * getFirstSundayAfter
 *
 * Description:
 * Returns date that's closest sunday after date, if date is not already sunday
 * @param date
 */
export function getFirstSundayAfter(date: Date) {
    const ret = new Date(date.getTime());
    // default sunday to 7
    const day = ret.getDay() || 7;
    if (day !== 7)
        ret.setHours(24 * (7 - day));
    return ret;
}


/**
 * getDiffInDays
 *
 * Description:
 * Returns number of days between dates. NOT timezone aware
 */
export function getDiffInDays(date1: Date, date2: Date) {
    // https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript

    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

/**
 * setStartOfDay
 *
 * Description:
 * Sets start of day
 */
export function setStartOfDay(date1: Date) {
    date1.setHours(0,0,0,0)
    return date1
}

/**
 * setEndOfDay
 *
 * Description:
 * Sets end of day
 */
export function setEndOfDay(date1: Date) {
    date1.setHours(23,59,59,999)
    return date1
}
