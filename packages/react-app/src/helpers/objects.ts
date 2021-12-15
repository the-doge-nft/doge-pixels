import { KeysOf } from "./interfaces";

export function getShallowEqualDiffKeys<T, T2>(obj1: T, obj2: T2): Extract<keyof T | keyof T2, string>[] {
  const diff: Extract<keyof T | keyof T2, string>[] = [];
  for (const [key] of Object.entries(obj1)) {
    //@ts-ignore
    // eslint-disable-next-line
    if (obj1[key] != obj2[key]) {
      //@ts-ignore
      diff.push(key);
    }
  }
  for (const [key] of Object.entries(obj2)) {
    //@ts-ignore
    // eslint-disable-next-line
    if (obj2[key] != obj1[key]) {
      //@ts-ignore
      if (!diff.includes(key)) {
        //@ts-ignore
        diff.push(key);
      }
    }
  }
  return diff;
}

export function objectShallowIsEqual(obj1: object, obj2: object) {
  return getShallowEqualDiffKeys(obj1, obj2).length === 0;
}

/**
 *
 * mutateNullKeyValsToEmptyString
 *
 * mutates object setting null keys to empty strings
 *
 *
 * @param object ie {thing: null} -> {thing: ""}
 *
 **/
export function mutateNullKeyValsToEmptyString(obj: object) {
  Object.keys(obj).forEach(key => {
    // @ts-ignore
    if (obj[key] === null) obj[key] = "";
  });
}

/**
 *
 * ObjectKeys
 *
 * Description:
 * TS compatible version of Object.keys
 *
 */
export function ObjectKeys<T>(obj: T): KeysOf<T>[] {
  return Object.keys(obj) as KeysOf<T>[];
}

/**
 *
 * objectShallowClone
 *
 * Description:
 * Shallow copy using spread operator
 *
 */
export function objectShallowClone<T>(obj: T): T {
  return { ...obj };
}
