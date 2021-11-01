import { FieldState } from "final-form";
import { t } from "@lingui/macro";

export type ValidatorFunction = (value: any, allValues: Object, meta?: FieldState<any>) => any;

const required = (value: any) => (value ? undefined : t`Required`);

const mustBeANumber = (value: any) => (isNaN(value) ? t`Must be a number` : undefined);

const minValue = (min: any) => (value: any) =>
  isNaN(value) || value >= min ? undefined : t`Must be greater than ${min}`;

const maxValue = (max: any, customString?: string) => (value: any) => {
  const stringToReturn = customString ? customString : t`Must be less than ${max}`;
  return isNaN(value) || value <= max ? undefined : stringToReturn;
};

const exactLength = (length: any) => (value: string) =>
  value.length === length ? undefined : t`Must be ${length} characters long`;

const noNegativeBalances = (customString?: string) => (value: any) => {
  // const stringToReturn = customString ? customString : t`Must settle all balances before withdrawing`
  // return !AppStore.balances.userHasNegativeBalances ? undefined : stringToReturn
};

const composeValidators =
  (...validators: any[]) =>
  (value: any) =>
    validators.reduce((error, validator) => error || validator(value), undefined);

export { required, mustBeANumber, minValue, maxValue, exactLength, noNegativeBalances, composeValidators };
