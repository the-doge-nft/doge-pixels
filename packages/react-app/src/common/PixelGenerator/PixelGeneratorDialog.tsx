import { observer } from "mobx-react-lite";
import PixelGeneratorModalStore from "../../pages/Viewer/PixelGeneratorModal/PixelGeneratorModal.store";
import {Box, Center, Divider, Flex, Grid, useColorMode} from "@chakra-ui/react";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import AppStore from "../../store/App.store";
import {darkModeSecondary, lightModePrimary} from "../../DSL/Theme";
import Button from "../../DSL/Button/Button";
import Form from "../../DSL/Form/Form";
import Submit from "../../DSL/Form/Submit";
import Loading from "../../DSL/Loading/Loading";
import PixelGeneratorDialogStore, {PixelGeneratorModalView} from "./PixelGeneratorDialog.store";
import Link from "../../DSL/Link/Link";
import {getEtherscanURL} from "../../helpers/links";
import ColorPane from "../../DSL/ColorPane/ColorPane";
import GridPane from "../../DSL/GridPane/GridPane";

interface PixelGeneratorDialogProps {
  store: PixelGeneratorDialogStore;
  onSuccess?: (burnedPixelIDs: number[]) => void;
  onCompleteClose: () => void
}

const PixelGeneratorDialog = observer(({store, onCompleteClose, onSuccess}: PixelGeneratorDialogProps) => {
  // useEffect(() => {
  //   if (store.currentView === PixelGeneratorModalView.Complete) {
  //     onSuccess && onSuccess(store.selectedPixels)
  //     AppStore.web3.refreshPupperOwnershipMap()
  //     AppStore.web3.refreshPupperBalance()
  //     AppStore.web3.refreshDogBalance()
  //   }
  //   // eslint-disable-next-line
  // }, [store.currentView])

  return <>
    {store.currentView === PixelGeneratorModalView.Select && <SelectColor store={store}/>}
    {store.currentView === PixelGeneratorModalView.LoadingGenerate && <LoadingGenerate store={store}/>}
    {store.currentView === PixelGeneratorModalView.Complete && <Complete onSuccess={onCompleteClose} txHash={store.txHash}/>}
  </>
})

const SelectColor = observer(({store}: { store: PixelGeneratorModalStore}) => {
  const {colorMode} = useColorMode()
  return <Flex flexDirection={"column"}>
    <GridPane colors={store.gridColors} onClick={(index) => store.onPaint(index)} />
    {store.isUserPixelOwner && <>
        <Flex mt={3}>
          <Box
            width= {"73px"}
            height={"74px"}
            bg={store.selectedColor}
            borderColor={"black"}
          />
       
       <Center height='74px' mx={2} borderColor={"black"}>
          <Divider orientation='vertical' />
        </Center>      
          <Grid overflow={"auto"} flexGrow={1} h={"full"} justifyContent={"flex-start"} >
              <Box
                  maxHeight={AppStore.rwd.isMobile ? "250px" : "350px"}
                  // width={"416px"}
                  
              >
                {AppStore.web3.puppersOwned.map(px => {
                  const hex = AppStore.web3.pupperToHexLocal(px)
                  const index = AppStore.web3.pupperToIndexLocal(px)
                  const isPixelSelected = store.selectedColor
                  return <Box
                              my={1}
                              mx={1}
                              display={"inline-block"}
                              _touch={{
                                bg: (colorMode === "light" ? lightModePrimary : darkModeSecondary)
                              }}>
                                <ColorPane 
                                  color= {hex}
                                  onClick={() => store.handlePixelSelect(hex)}
                                />
                                
                  </Box>
                })}
              </Box>
          </Grid>
        </Flex>

        <Flex justifyContent={"center"} mt={3} w={"full"}>
            <Box>
                <Form onSubmit={async () => store.pushNavigation(PixelGeneratorModalView.LoadingGenerate)}>
                    <Flex justifyContent={"center"} w={"100%"}>
                        <Submit label={"Generate"} />
                    </Flex>
                </Form>
            </Box>
        </Flex>
    </>}
  </Flex>
})

const LoadingGenerate = observer(({store}: {store: PixelGeneratorModalStore}) => {
  // useEffect(() => {
  //   store.burnSelectedPixels()
  //   // eslint-disable-next-line
  // }, [])
  return (
    <Box>
      <Loading title={"Burning..."} showSigningHint={!store.hasUserSignedTx}/>
    </Box>
  )
})

const Complete = observer(({onSuccess, txHash}: {onSuccess: () => void, txHash: string | null}) => {
  return <Box>
    <Typography variant={TVariant.PresStart28} textAlign={"center"} block>
      Pixels Burned
    </Typography>
    <Typography variant={TVariant.PresStart28} textAlign={"center"} mt={4} block>
      🔥🔥🔥
    </Typography>
    <Flex justifyContent={"center"} mt={12}>
      <Button onClick={() => onSuccess()}>Close</Button>
    </Flex>
    <Flex justifyContent={"center"} mt={10}>
      {txHash && <Link href={getEtherscanURL(txHash, "tx")} isExternal>View tx</Link>}
    </Flex>
  </Box>
})

export default PixelGeneratorDialog
