import React from "react";
import Button, {ButtonProps} from "../Button/Button";
import {useFormState} from "react-final-form";
import {ObjectKeys} from "../../helpers/objects";
import {t} from "@lingui/macro";
import {observer} from "mobx-react-lite";

interface SubmitProps extends ButtonProps {
  label?: string;
  isLoading?: boolean;
}

const Submit = observer(({ label, onClick, isLoading, isDisabled, ...rest }: SubmitProps) => {
  const { submitting, errors } = useFormState();
  // const disabled = submitting ? submitting : (ObjectKeys(errors).length > 0 || isDisabled)

  return (
    <Button
      submit
      onClick={onClick}
      isLoading={submitting || isLoading}
      isDisabled={isDisabled || ObjectKeys(errors).length > 0 }
      {...rest}
    >
      {label ? label : t`Submit`}
    </Button>
  );
});

export default Submit;
