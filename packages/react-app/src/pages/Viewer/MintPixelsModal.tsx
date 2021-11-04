import React, { useMemo } from "react";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import Form from "../../DSL/Form/Form";
import NumberInput from "../../DSL/Form/NumberInput/NumberInput";
import {maxValue, minValue, required} from "../../DSL/Form/validation";
import Submit from "../../DSL/Form/Submit";
import Modal, { ModalProps } from "../../DSL/Modal/Modal";
import Slider from "../../DSL/Slider/Slider";
import MintPixelsModalStore from "./MintPixelsModal.store";
import model from "../../DSL/Form/model";
import { observer } from "mobx-react-lite";

interface MintPixelsModalProps extends Pick<ModalProps, "isOpen" | "onClose"> {}

const MintPixelsModal = observer(({ isOpen, onClose }: MintPixelsModalProps) => {
  const store = useMemo(() => new MintPixelsModalStore(), []);
  return (
    <Modal
      size={"lg"}
      isOpen={isOpen}
      onClose={() => onClose()}
      renderHeader={() => <Typography variant={TVariant.Title22}>Mint Pixels</Typography>}
    >
      <Box>
        <Typography variant={TVariant.Body14}>
          Trade your $DOG for pixels. "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
          esse cillum dolore eu fugiat nulla pariatur.
        </Typography>
      </Box>
      <Form
        onSubmit={async (data, form) => {
          console.log("debug::formdata::", data);
        }}
      >
        <Grid templateColumns={"repeat(2, 1fr)"} mt={5}>
          <GridItem colSpan={1} mr={3}>
            <NumberInput
                label={"Pixels"}
                validate={[required, minValue(1, "You mint at least one pixel ser"), maxValue(100)]}
                {...model(store, "pixel_count")}
                stepper
            />
          </GridItem>
          <GridItem colSpan={1} ml={3}>
            <NumberInput
              label={"$DOG"}
              onChange={() => {}}
              name={"dog_count"}
              validate={required}
              value={store.dogCount}
              isDisabled={true}
            />
          </GridItem>
        </Grid>
        <Submit label={"Mint"} w={"100%"} size={"md"} mt={10} />
      </Form>
    </Modal>
  );
});

export default MintPixelsModal;
