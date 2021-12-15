import { composeValidators, required } from "./validation";
import { useField } from "react-final-form";
import { useEffect } from "react";

const parse = (value: any) => {
  if (value === undefined || value === null) {
    return "";
  } else {
    return value;
  }
};

export const useFormField = (validate: any, name: any, initialValue: any, isCheckbox: boolean = false) => {
  const isRequired = Array.isArray(validate) ? validate.includes(required) : validate === required;
  const validators = Array.isArray(validate) ? composeValidators(...validate) : validate;

  const { input, meta } = useField(name, {
    validate: validators,
    initialValue: initialValue,
    type: isCheckbox ? "checkbox" : "input",
    /*
            without below parse fn, empty string input's keys are removed from the form state,
            screwing up FormState.modified & FormState.dirty.
            https://github.com/final-form/react-final-form/issues/130

            we return "" for undefined & nulls to avoid react controlled to uncontrolled warnings
        * */
    parse: parse,
  });

  if (isCheckbox) {
    const { checked: inputValue, onChange: inputOnChange, ...restInput } = input;
    return {
      isRequired,
      inputValue,
      inputOnChange,
      restInput,
      meta,
    };
  } else {
    const { value: inputValue, onChange: inputOnChange, ...restInput } = input;
    return {
      isRequired,
      inputValue,
      inputOnChange,
      restInput,
      meta,
    };
  }
};

export const useControlledFormField = (inputOnChange: (value: any) => void, value: any) => {
  // TODO: probably change this
  // if controlled
  // - onChange handler from input calls onChange prop
  // - onChange prop *should* change the value prop causing below effect to update the actual input
  // - if value is changed from the outside, we need this effect to update the input
  useEffect(() => {
    if (value !== undefined && value !== null) {
      inputOnChange(value);
    }
    // eslint-disable-next-line
  }, [value]);
};
