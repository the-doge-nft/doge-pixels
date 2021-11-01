import React from "react";
import Button, { ButtonProps } from "../Button/Button";
import { useFormState } from "react-final-form";
import { ObjectKeys } from "../../helpers/objects";
import { t } from "@lingui/macro";
import Typography from "../Typography/Typography";

interface SubmitProps extends ButtonProps {
  label?: string;
  isLoading?: boolean;
  size?: string;
}

const Submit = ({ label, onClick, isLoading, ...rest }: SubmitProps) => {
  const { submitting, errors } = useFormState();
  return (
    <Button
      onClick={onClick}
      isLoading={submitting || isLoading}
      submit
      isDisabled={ObjectKeys(errors).length > 0}
      {...rest}
    >
      {label ? label : t`Submit`}
    </Button>
  );
};

export default Submit;
