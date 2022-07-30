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
import { useEffect } from "react";

interface PixelGeneratorDialogProps {
  store: PixelGeneratorDialogStore;
  onSuccess?: (burnedPixelIDs: number[]) => void;
  onCompleteClose: () => void
}

const PixelGeneratorDialog = observer(({store, onCompleteClose, onSuccess}: PixelGeneratorDialogProps) => {
  useEffect(() => {
    if (store.currentView === PixelGeneratorModalView.Complete) {
      AppStore.web3.refreshPupperOwnershipMap()
    }
    // eslint-disable-next-line
  }, [store.currentView])

  return <>
    {store.currentView === PixelGeneratorModalView.Select && <SelectColor store={store}/>}
    {store.currentView === PixelGeneratorModalView.LoadingGenerate && <LoadingGenerate store={store}/>}
    {store.currentView === PixelGeneratorModalView.Complete && <Complete onSuccess={onCompleteClose}/>}
  </>
})

const SelectColor = observer(({store}: { store: PixelGeneratorModalStore}) => {
  const {colorMode} = useColorMode()
  return <Flex flexDirection={"column"}>
      <Flex margin="auto" flexDirection={"column"}>
      <GridPane colors={store.gridColors} onClick={(index) => store.onPaint(index)} isGrid={true} />
      <Flex position={"absolute"} zIndex={-1}>
        <GridPane colors={store.pngColors} isGrid={false}/>
      </Flex >
      </Flex>
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
              >
                {AppStore.web3.puppersOwned.map(px => {
                  const hex = AppStore.web3.pupperToHexLocal(px)
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
                <Form onSubmit={async () => store.generatingPixels()}>
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
  useEffect(() => {
    const node = document.getElementById('my-art');
    // store.generatingPixels(node)
    // eslint-disable-next-line
  }, [])
  return (
    <Box>
      <Loading title={"Generating..."} showSigningHint={false}/>
    </Box>
  )
})

const Complete = observer(({onSuccess}: {onSuccess: () => void}) => {
  return <Box>
    <Typography variant={TVariant.PresStart28} textAlign={"center"} block>
      Pixels Generated
    </Typography>
  </Box>
})

export default PixelGeneratorDialog
