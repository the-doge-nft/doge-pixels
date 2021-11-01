/**
 *
 * KeysOf<T>
 *
 * Description:
 * Syntax sugar for extracting only 'string' type from keys of some interface.
 *
 * Why:
 * using plain `keyof T` when you want to indicate you require the string to be key of some interface leads to
 * typescript error that 'key' type doesnt match 'string'. Extracting only 'string' type fixes the issue
 *
 * When:
 * KeysOf<SomeInterface> should be used whenever you want to indicate a string as a key of some interface
 */
export type KeysOf<SomeInterface> = Extract<keyof SomeInterface, string>;
