import React, {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {Box, Flex} from "@chakra-ui/react";
import MintPixelsModalStore from "../../pages/Viewer/MintPixelsModal/MintPixelsModal.store";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import Form from "../../DSL/Form/Form";
import BigInput from "../../DSL/Form/BigInput";
import {maxValue, minValue, required} from "../../DSL/Form/validation";
import {formatWithThousandsSeparators} from "../../helpers/numberFormatter";
import Submit from "../../DSL/Form/Submit";
import {ethers} from "ethers";
import CheckboxInput from "../../DSL/Form/CheckboxInput/CheckboxInput";
import model from "../../DSL/Form/model";
import Button from "../../DSL/Button/Button";
import Loading from "../../DSL/Loading/Loading";
import Link from "../../DSL/Link/Link";
import {getEtherscanURL} from "../../helpers/links";
import MintPixelsDialogStore, { MintModalView } from "./MintPixelsDialog.store";
import AppStore from "../../store/App.store";

interface MintPixelsDialogProps {
  store: MintPixelsDialogStore;
  onSuccess: () => void;
  onGoToPixelsClick: () => void
}

const MintPixelsDialog = observer(({store, onSuccess, onGoToPixelsClick}: MintPixelsDialogProps) => {
  useEffect(() => {
    store.init()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (store.currentView === MintModalView.Complete) {
      onSuccess && onSuccess()
    }
  }, [store.currentView, onSuccess])

  return <>
    {store.currentView === MintModalView.Mint && <MintForm store={store}/>}
    {store.currentView === MintModalView.Approval && <Approval store={store}/>}
    {store.currentView === MintModalView.LoadingApproval && <LoadingApproval store={store}/>}
    {store.currentView === MintModalView.LoadingPixels && <LoadingPixels store={store}/>}
    {store.currentView === MintModalView.Complete && <Complete onSuccess={onGoToPixelsClick} txHash={store.txHash}/>}
  </>
})

const MintForm = observer(({ store }: { store: MintPixelsModalStore }) => {
  return (
    <>
      <Typography variant={TVariant.ComicSans18}>
        Trade $DOG for pixels. Each pixel is worth 55,240 $DOG.
      </Typography>
      <Form onSubmit={async (data) => store.handleMintSubmit(data.pixel_count)}>
        <Box mt={5}>
          <BigInput
            store={store}
            storeKey={"pixel_count"}
            label={"PX"}
            validate={[
              required,
              minValue(1, "Must mint at least 1 pixel"),
              maxValue(store.maxPixelsToPurchase, `Not enough $DOG 😕`)
            ]}
            renderLeftOfValidation={() => {
              return <Box>
                <Typography variant={TVariant.PresStart20} block>
                  $DOG
                </Typography>
                <Typography variant={TVariant.ComicSans14} block>
                  {formatWithThousandsSeparators(store.dogCount)}
                </Typography>
              </Box>
            }}
          />
        </Box>
        <Flex justifyContent={"center"}>
          <Submit label={"Mint"} mt={10}/>
        </Flex>
      </Form>
    </>
  );
});

const Approval = observer(({store}: {store: MintPixelsModalStore}) => {
  return (
    <Box>
      <Box my={6}>
        {store.approveInfinite
          ? <Flex justifyContent={"center"}>
            <Typography display={"block"} variant={TVariant.PresStart45} lineHeight={"normal"}>
              &infin;
            </Typography>
          </Flex>
          : <Typography display={"block"} variant={TVariant.PresStart30}>
            {formatWithThousandsSeparators(ethers.utils.formatEther(store.allowanceToGrant))}
          </Typography>
        }
      </Box>
      <Typography block variant={TVariant.ComicSans18} mt={4}>
        Please approve $DOG to be spent for pixels.
      </Typography>
      <Form onSubmit={async () => store.pushNavigation(MintModalView.LoadingApproval)}>
        <Box mt={5}>
          <CheckboxInput {...model(store, "approveInfinite")} label={"Approve infinite"}/>
        </Box>
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

const LoadingApproval = observer(({store}: {store: MintPixelsModalStore}) => {
  useEffect(() => {
    store.approveDogSpend()
    // eslint-disable-next-line
  }, [])
  return (
    <Box mt={20} mb={10}>
      <Loading
        title={"Approving..."}
        showSigningHint={!store.hasUserSignedTx}
      />
    </Box>
  )
})

const LoadingPixels = observer(({store}: {store: MintPixelsModalStore}) => {
  useEffect(() => {
    store.mintPixels(Number(store.pixel_count!))
    // eslint-disable-next-line
  }, [])
  return (
    <Box mt={20} mb={10}>
      <Loading
        title={"Minting..."}
        showSigningHint={!store.hasUserSignedTx}
      />
    </Box>
  );
});

const Complete = observer(({onSuccess, txHash}: {onSuccess: () => void, txHash: string | null}) => {
  return <Box pt={10} pb={4}>
    <Typography variant={TVariant.PresStart28} textAlign={"center"} block>
      Pixels Minted
    </Typography>
    <Typography variant={TVariant.PresStart28} textAlign={"center"} mt={4} block>
      🌟🦄💫🐸🐕🚀
    </Typography>
    <Flex justifyContent={"center"} mt={12}>
      <Button onClick={() => onSuccess()}>Go to pixels</Button>
    </Flex>
    <Flex justifyContent={"center"} mt={10}>
      {txHash && <Link href={getEtherscanURL(txHash, "tx")} isExternal>View tx</Link>}
    </Flex>
  </Box>
})

export default MintPixelsDialog