import {observer} from "mobx-react-lite";
import {useEffect, useMemo} from "react";
import Modal, {ModalProps} from "../../../DSL/Modal/Modal";
import Typography, {TVariant} from "../../../DSL/Typography/Typography";
import MintPixelsModalStore, {MintModalView} from "./MintPixelsModal.store";
import Button from "../../../DSL/Button/Button";
import {Box, Flex, Grid, GridItem} from "@chakra-ui/react";
import Form from "../../../DSL/Form/Form";
import NumberInput from "../../../DSL/Form/NumberInput/NumberInput";
import {maxValue, minValue, required} from "../../../DSL/Form/validation";
import model from "../../../DSL/Form/model";
import AppStore from "../../../store/App.store";
import Dev from "../../../common/Dev";
import Submit from "../../../DSL/Form/Submit";
import Loading from "../Loading/Loading";
import BigInput from "../../../DSL/Form/BigInput";

interface MintPixelsModalProps extends Pick<ModalProps, "isOpen" | "onClose"> {}

const MintPixelsModal = observer(({ isOpen, onClose }: MintPixelsModalProps) => {
  const store = useMemo(() => new MintPixelsModalStore(), [isOpen]);
  useEffect(() => {
    if (isOpen) {
      store.init()
    }
  }, [isOpen])
  return (
    <Modal
      size={"xl"}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      renderHeader={() => <Typography variant={TVariant.PresStart18}>{store.modalTitle}</Typography>}
    >
      {store.currentView === MintModalView.Mint && <MintForm store={store}/>}
      {store.currentView === MintModalView.Approval && <Approval store={store}/>}
      {store.currentView === MintModalView.Loading && <LoadingPixels store={store}/>}
      {store.currentView === MintModalView.Complete && <Complete store={store}/>}
    </Modal>
  );
});

const MintForm = observer(({ store }: { store: MintPixelsModalStore }) => {
  return (
    <>
      <Box>
        <Typography variant={TVariant.ComicSans14}>
          Trade $DOG for pixels. Each pixel is worth 55,240 $DOG.
        </Typography>
      </Box>

      <Form onSubmit={(data) => store.handleMintSubmit(data.pixel_count)}>
        <Box mt={5}>
          <BigInput
            store={store}
            storeKey={"pixel_count"}
            label={"PX"}
            validate={[
              required,
              minValue(1, "Must mint at least 1 pixel"),
              maxValue(store.maxPixelsToPurchase, "Need to buy more $DOG")
            ]}
          />
        </Box>
        <Box mt={8}>
          <Typography variant={TVariant.PresStart18} block>
            $DOG
          </Typography>
          <Typography variant={TVariant.PresStart18} block mt={2}>
            {store.dogCount}
          </Typography>
        </Box>
        <Flex justifyContent={"center"}>
          <Submit label={"Mint"} mt={10}/>
        </Flex>
      </Form>

      <Dev>
        <Flex direction={"column"}>
          {store.pixel_count !== undefined && <Typography variant={TVariant.ComicSans16}>
              to spend: {(store.pixel_count * AppStore.web3.DOG_TO_PIXEL_SATOSHIS) / 10 ** AppStore.web3.D20_PRECISION}
          </Typography>}
          {store.allowance !== undefined && <Typography variant={TVariant.ComicSans16}>
              allowance: {store.allowance / 10 ** AppStore.web3.D20_PRECISION}
          </Typography>}
        </Flex>
      </Dev>
    </>
  );
});

const Approval = observer(({store}: {store: MintPixelsModalStore}) => {
  return (
    <Box>
      <Typography display={"block"} variant={TVariant.PresStart28}>
        {store.allowanceToGrant / (10 ** AppStore.web3.D20_PRECISION)}
      </Typography>
      <Typography block variant={TVariant.ComicSans18} mt={4}>
        Please approve $DOG to be spent for pixels.
      </Typography>
      <Form onSubmit={() => store.handleApproveSubmit()}>
        <Flex
          flexDirection={"column"}
          mt={14}
          alignItems={"center"}
        >
          <Submit label={"Approve"} flexGrow={0}/>
          {store.showGoBack && <Button onClick={() => store.popNavigation()} mt={5}>
              Cancel
          </Button>}
        </Flex>
      </Form>
    </Box>
  );
});


const LoadingPixels = observer(({store}: {store: MintPixelsModalStore}) => {
  useEffect(() => {
    store.mintPixels(store.pixel_count!)
  }, [])
  return (
    <Box>
      <Typography variant={TVariant.ComicSans12}>
        <Loading/>
      </Typography>
    </Box>
  );
});

const Complete = observer(({store}: {store: MintPixelsModalStore}) => {
  return <Box>
      <Typography variant={TVariant.ComicSans12}>✨ Mint complete ✨</Typography>
    {store.newlyMintedPupperIds.map(item => <Box>
      {item}
    </Box>)}
  </Box>
})

export default MintPixelsModal;
