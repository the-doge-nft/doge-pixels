import React, {useMemo} from "react";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import {Box, Grid, GridItem} from "@chakra-ui/react";
import Form from "../../DSL/Form/Form";
import NumberInput from "../../DSL/Form/NumberInput/NumberInput";
import {maxValue, minValue, required} from "../../DSL/Form/validation";
import Submit from "../../DSL/Form/Submit";
import Modal, {ModalProps} from "../../DSL/Modal/Modal";
import MintPixelsModalStore, { MintModalView } from "./MintPixelsModal.store";
import model from "../../DSL/Form/model";
import {observer} from "mobx-react-lite";
import AppStore from "../../store/App.store";

interface MintPixelsModalProps extends Pick<ModalProps, "isOpen" | "onClose"> {}

const MintPixelsModal = observer(({ isOpen, onClose }: MintPixelsModalProps) => {
  const store = useMemo(() => new MintPixelsModalStore(), [isOpen]);
  return (
    <Modal
      size={"xl"}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      renderHeader={() => <Typography variant={TVariant.ComicSans28}>Mint Pixels</Typography>}
    >
      {store.currentView === MintModalView.Mint && <MintForm store={store} />}
      {store.currentView === MintModalView.Approval && <Approval />}
      {store.currentView === MintModalView.Loading && <Loading />}
      {store.currentView === MintModalView.Complete && <Complete />}
    </Modal>
  );
});

const MintForm = observer(({ store }: { store: MintPixelsModalStore }) => {
  return (
    <>
      <Box>
        <Typography variant={TVariant.ComicSans14}>
          Trade your $DOG for pixels. "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
          esse cillum dolore eu fugiat nulla pariatur.
        </Typography>
      </Box>
      <Form onSubmit={(data) => store.mintPixels(data.pixel_count)}>
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
              validate={[required, maxValue(AppStore.web3.dogBalance)]}
              value={store.dogCount}
              isDisabled={true}
            />
          {AppStore.web3.dogBalance && <Typography variant={TVariant.PresStart14}>$DOG avail: {AppStore.web3.dogBalance}</Typography>}
          </GridItem>
        </Grid>
        <Submit label={"Mint"} w={"100%"} mt={10} />
      </Form>
    </>
  );
});

const Approval = () => {
  return (
    <Box>
      <Typography variant={TVariant.ComicSans12}>Must approve token spend</Typography>
    </Box>
  );
};

const Loading = () => {
  return (
    <Box>
      <Typography variant={TVariant.ComicSans12}>Loading ⏳</Typography>
    </Box>
  );
};

const Complete = () => {
  return <Box>
      <Typography variant={TVariant.ComicSans12}>✨ Mint complete ✨</Typography>
  </Box>
}

export default MintPixelsModal;
