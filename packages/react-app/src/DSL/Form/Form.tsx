import { Form as ReactFinalForm } from "react-final-form";
import React from "react";
import FormError from "./FormError";
import { FORM_ERROR, FormApi } from "final-form";
import ApiError from "../../services/exceptions/api.error";

export interface FormProps {
  onSubmit: (params: any, form: FormApi) => Promise<any>;
  children?: any;
}

const Form = ({ onSubmit, children }: FormProps) => {
  const requestMiddleware = (data: any, form: FormApi) => {
    return onSubmit(data, form).catch(e => {
      if (e instanceof ApiError) {
        return { [FORM_ERROR]: e.error };
      } else {
        throw e;
      }
    });
  };

  return (
    <ReactFinalForm onSubmit={(data, form) => requestMiddleware(data, form)}>
      {({ handleSubmit, submitError, values }) => {
        return (
          <>
            <form onSubmit={handleSubmit}>
              {children}
              {submitError && <FormError error={submitError} />}
            </form>
            {/*<Dev>*/}
            {/*  <Box w={"100%"} mt={2}>*/}
            {/*    <Typography color={"gray.400"} variant={TVariant.PresStart12}>*/}
            {/*      {JSON.stringify(values)}*/}
            {/*    </Typography>*/}
            {/*  </Box>*/}
            {/*</Dev>*/}
          </>
        );
      }}
    </ReactFinalForm>
  );
};

export default Form;
