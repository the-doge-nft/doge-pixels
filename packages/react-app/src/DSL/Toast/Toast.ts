import { createStandaloneToast } from "@chakra-ui/react";
import theme from "../Theme";
import { isDevModeEnabled } from "../../environment/helpers";
import { t } from "@lingui/macro";

const toast = createStandaloneToast({ theme });

export const showErrorToast = (description: string) => {
  toast({
    title: t`Error`,
    isClosable: true,
    description: description,
    status: "error",
  });
};

export const showSuccessToast = (description: string) => {
  toast({
    title: t`Success`,
    isClosable: true,
    description: description,
    status: "success",
  });
};

export const showDebugToast = (description: string) => {
  if (isDevModeEnabled()) {
    toast({
      title: t`Debug`,
      isClosable: true,
      description: description,
      status: "warning",
    });
  }
};

export default toast;
