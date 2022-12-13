import { Box, Button, createStandaloneToast, Flex, useColorMode } from "@chakra-ui/react";
import { ReactNode } from "react";
import { NamedRoutes, route } from "../../App.routes";
import DSLButton from "../../DSL/Button/Button";
import { isDevModeEnabled } from "../../environment/helpers";
import { ButtonVariant } from "../Button/Button";
import { Type } from "../Fonts/Fonts";
import Link from "../Link/Link";
import theme, { darkModePrimary, lightOrDarkMode } from "../Theme";
import Typography, { TVariant } from "../Typography/Typography";

export const { ToastContainer, toast } = createStandaloneToast({ theme: theme });

interface ToastBaseProps {
  title?: string;
  description: ReactNode;
  onClose: () => void;
  id: number | string;
  variant: "success" | "error" | "debug" | "info";
}

const ToastBase = ({ title, description, onClose, id, variant }: ToastBaseProps) => {
  const { colorMode } = useColorMode();
  const colorToVariant = {
    success: "green.500",
    error: "red.500",
    debug: "orange.400",
    info: lightOrDarkMode(colorMode, "yellow.50", darkModePrimary),
  };
  return (
    <Box
      p={3}
      borderWidth={"1px"}
      borderStyle={"solid"}
      borderColor={lightOrDarkMode(colorMode, "black", "white")}
      borderRadius={"0px"}
      bg={colorToVariant[variant]}
      color={"white"}
    >
      <Flex justifyContent={"space-between"} alignItems={"start"}>
        {title && (
          <Typography
            variant={TVariant.PresStart12}
            mb={2}
            block
            color={variant !== "info" ? "white" : lightOrDarkMode(colorMode, "black", "white")}
          >
            {title}
          </Typography>
        )}
        <Button
          size={"sm"}
          onClick={onClose}
          variant={ButtonVariant.Text}
          p={0}
          minWidth={0}
          height={"fit-content"}
          color={variant !== "info" ? "white" : lightOrDarkMode(colorMode, "black", "white")}
          _active={{
            boxShadow: "none",
          }}
          _focus={{
            boxShadow: "none",
          }}
        >
          x
        </Button>
      </Flex>
      <Typography variant={TVariant.ComicSans12} block color={"white"}>
        {description}
      </Typography>
    </Box>
  );
};

export const showErrorToast = (description: string) => {
  toast({
    isClosable: true,
    render: props => {
      const { id, onClose } = props;
      return <ToastBase title={"Error"} description={description} onClose={onClose} id={id} variant={"error"} />;
    },
  });
};

export const showSuccessToast = (description: string) => {
  toast({
    isClosable: true,
    render: props => {
      const { id, onClose } = props;
      return <ToastBase title={"Success"} description={description} onClose={onClose} id={id} variant={"success"} />;
    },
  });
};

export const showDebugToast = (description: string) => {
  if (isDevModeEnabled()) {
    toast({
      isClosable: true,
      render: props => {
        const { id, onClose } = props;
        return <ToastBase title={"Debug"} description={description} onClose={onClose} id={id} variant={"debug"} />;
      },
    });
  }
};

export const showInfoToast = (description: ReactNode) => {
  toast({
    isClosable: false,
    render: props => {
      const { id, onClose } = props;
      return <ToastBase title={"Info"} description={description} onClose={onClose} id={id} variant={"info"} />;
    },
  });
};

export const showTOSToast = (onClose: () => void) => {
  toast({
    duration: null,
    position: "bottom-right",
    isClosable: false,
    render: props => {
      const { id, onClose: toastOnClose } = props;
      return (
        <ToastBase
          title={"Legal Notice"}
          description={
            <Box>
              <Typography variant={TVariant.ComicSans14}>
                We have recently updated our{" "}
                <Link target={"_blank"} to={route(NamedRoutes.TERMS)} fontSize={"14px"} variant={Type.ComicSans}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link target={"_blank"} to={route(NamedRoutes.PRIVACY)} fontSize={"14px"} variant={Type.ComicSans}>
                  Privacy Policy
                </Link>
              </Typography>
              <Flex justifyContent={"center"} mt={4} mb={2}>
                <DSLButton
                  size={"sm"}
                  onClick={() => {
                    toastOnClose();
                    onClose();
                  }}
                >
                  Accept
                </DSLButton>
              </Flex>
            </Box>
          }
          onClose={() => {
            toastOnClose();
            onClose();
          }}
          id={id}
          variant={"info"}
        />
      );
    },
  });
};

export default toast;
