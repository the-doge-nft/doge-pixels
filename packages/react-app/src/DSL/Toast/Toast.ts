import { createStandaloneToast } from "@chakra-ui/react";
import theme from "../Theme";
import { isDevModeEnabled } from "../../environment/helpers";
import { t } from "@lingui/macro";

const toast = createStandaloneToast({ theme: theme });

export const showErrorToast = (description: string) => {
  toast({
    title: t`Error`,
    isClosable: true,
    description: description,
    status: "error",
    variant: "solid"
  });
};

export const showSuccessToast = (description: string) => {
  toast({
    title: t`Success`,
    isClosable: true,
    description: description,
    status: "success",
    variant: "solid",
  });
};

export const showDebugToast = (description: string) => {
  if (isDevModeEnabled()) {
    toast({
      title: t`Debug`,
      isClosable: true,
      description: description,
      status: "warning",
      variant: "solid"
    });
  }
};

export default toast;
