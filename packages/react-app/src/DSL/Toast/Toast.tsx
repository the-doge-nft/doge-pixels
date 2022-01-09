import {Box, Button, createStandaloneToast, Flex } from "@chakra-ui/react";
import theme from "../Theme";
import { isDevModeEnabled } from "../../environment/helpers";
import {ButtonVariant} from "../Button/Button";
import Typography, { TVariant } from "../Typography/Typography";

const toast = createStandaloneToast({ theme: theme });

interface ToastBaseProps {
  title: string;
  description: string;
  onClose: () => void;
  id: number | string;
  variant: "success" | "error" | "debug"
}

const ToastBase = ({title, description, onClose, id, variant}: ToastBaseProps) => {
  const colorToVariant = {
    success: "green.500",
    error: "red.500",
    debug: "orange.400"
  }
  return <Box p={3} border={"1px solid black"} borderRadius={"0px"} bg={colorToVariant[variant]} color={"white"}>
    <Flex justifyContent={"space-between"} alignItems={"start"}>
      <Typography variant={TVariant.PresStart15} mb={2} block color={"white"}>{title}</Typography>
      <Button
        size={"sm"}
        onClick={onClose}
        variant={ButtonVariant.Text}
        p={0}
        minWidth={0}
        height={"fit-content"}
        color={"white"}
        _active={{
          boxShadow: "none"
        }}
        _focus={{
          boxShadow: "none"
        }}
      >
        x
      </Button>
    </Flex>
    <Typography variant={TVariant.ComicSans12} block color={"white"}>{description}</Typography>
  </Box>
}

export const showErrorToast = (description: string) => {
  toast({
    isClosable: true,
    render: (props) => {
      const {id, onClose} = props
      return <ToastBase
        title={"Error"}
        description={description}
        onClose={onClose}
        id={id}
        variant={"error"}
      />
    }
  });
};

export const showSuccessToast = (description: string) => {
  toast({
    isClosable: true,
    render: (props) => {
      const {id, onClose} = props
      return <ToastBase
        title={"Success"}
        description={description}
        onClose={onClose}
        id={id}
        variant={"success"}
      />
    }
  });
};

export const showDebugToast = (description: string) => {
  if (isDevModeEnabled()) {
    toast({
      isClosable: true,
      render: (props) => {
        const {id, onClose} = props
        return <ToastBase
          title={"Debug"}
          description={description}
          onClose={onClose}
          id={id}
          variant={"debug"}
        />
      }
    });
  }
};

export default toast;
