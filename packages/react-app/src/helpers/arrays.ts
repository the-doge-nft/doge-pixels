/**
 * Returns array of matching objects by key `field` from src. Order of returning array is determined by order of objects in `search`
 * @param src array of object with key `field` to search from
 * @param search array of objects with key `field` to search
 * @param field
 */

export function arrayCrossSetByField<T, L, K extends keyof T, I extends keyof L>(
  src: T[],
  search: L[],
  field: I & K = "id" as any,
): T[] {
  return search.reduce((accumulator, currentValue) => {
    const item = arrayFindByField(src, currentValue[field], field);
    if (item) {
      accumulator.push(item);
    }
    return accumulator;
  }, [] as T[]);
}

/**
 * Returns array of elements present in `search` but missing in `src`.
 * @param src array of object with key `field` to search from
 * @param search array of objects with key `field` to search
 * @param field
 */
export function arrayDiffSetByField<T, L, K extends keyof T, I extends keyof L>(
  src: T[],
  search: L[],
  field: I & K = "id" as any,
): (T | L)[] {
  return search.reduce((accumulator, currentValue) => {
    const item = arrayFindByField(src, currentValue[field], field);
    if (!item) {
      accumulator.push(currentValue);
    }
    return accumulator;
  }, [] as L[]);
}

export function arrayFindByField<T, K extends keyof T>(array: T[], val: any, field: K = "id" as any): T | undefined {
  // eslint-disable-next-line
  return array.find(item => item[field] == val);
}

export function arrayFindByFieldOrFail<T, K extends keyof T>(array: T[], val: any, field: K = "id" as any): T {
  const ret = arrayFindByField(array, val, field);
  if (!ret) {
    console.error("arrayFindByFieldOrFail data:", array, val, field);
    //@ts-ignore
    throw new Error(`Couldn't find object in array by field: ` + field + "=" + val);
  }
  return ret;
}

/**
 *
 * arrayFuzzyFilterByKey
 *
 * Description:
 * Used by <Select> to filter items based on inputValue. Can be used by other components to achieve same-behaviour filtering
 * on some arrays you need to filter
 */
export function arrayFuzzyFilterByKey<T, K extends keyof T>(array: T[], val: any, field: K = "name" as any): T[] {
  if (val === "" || val === null) {
    return array;
  }
  return array.filter(item => {
    if (typeof item[field] !== "string") {
      console.warn(
        `Got unexpected value when filtering array, supposed to be 'string' got '${typeof item[field]}`,
        item,
        item[field],
      );
      return false;
    }
    return (item[field] as unknown as string).toLowerCase().startsWith(val.toLowerCase());
  });
}

export function arrayFindIndexByField<T, K extends keyof T>(
  array: T[],
  val: any,
  field: K = "id" as any,
): number | null {
  // eslint-disable-next-line
  return array.findIndex(item => item[field] == val);
}

export function arrayUnique<T>(array: T[]): T[] {
  return array.filter((value, index, self) => {
    return array.indexOf(value) === index;
  });
}

export function arrayUniqueByField<T, K extends keyof T>(array: T[], field: K = "id" as any): T[] {
  return array.filter((value, index, self) => {
    return arrayFindIndexByField(array, value[field], field) === index;
  });
}

export function arrayToMemo<T>(array: T[], field: keyof T = "id" as any): string {
  return array.map(item => item[field]).join(",") + array.length;
}

export function arrayRemoveImmutable<T>(arr: T[], index: number) {
  const ret = ([] as T[]).concat(arr);
  ret.splice(index, 1);
  return ret;
}

export function arrayPushImmutable<T>(arr: T[], newObj: T) {
  const ret = ([] as T[]).concat(arr);
  ret.push(newObj);
  return ret;
}

export function arrayUnshiftImmutable<T>(arr: T[], newObj: T) {
  const ret = ([] as T[]).concat(arr);
  ret.unshift(newObj);
  return ret;
}

export function arrayRange(range: number) {
  // @ts-ignore
  return [...Array(range).keys()];
}

export function arrayMerge<T>(array1: T[], array2: T[]): T[] {
  return ([] as T[]).concat(array1, array2);
}

export function arraySortByAbsoluteValue<T>(array: T[], key: keyof T): T[] {
  const arr = ([] as T[]).concat(array);
  arr.sort((a, b) => {
    const c = Math.abs(Number(a[key]));
    const d = Math.abs(Number(b[key]));
    if (c > d) {
      return -1;
    } else if (d > c) {
      return 1;
    } else {
      return 0;
    }
  });
  return arr;
}
