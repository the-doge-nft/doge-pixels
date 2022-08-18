import { Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import AppStore from "../../store/App.store";
import SharePixelsDialogStore from "./SharePixelsDialog.store";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from "react-share";
import { Http } from "../../services";

interface SharePixelsDialogProps {
  store: SharePixelsDialogStore;
  isMinted: boolean;
}

const SharePixelsDialog = observer(({store, isMinted}: SharePixelsDialogProps) => {
  const [image, setImage] = useState();
  const [shareURL, setShareURL] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (AppStore.web3.updatedPuppers.length > 0) {
      Http.post("/v1/puppers/share", {
        puppers: AppStore.web3.updatedPuppers,
        isMinted
      }).then(({data}) => {
            setImage(data.image)
            setShareURL(data.url)
        }).catch(err => {
            console.log(err.message)
        }).finally(() => {
            setIsLoading(false)
        });
    }
  }, [AppStore.web3.updatedPuppers])

  return <>{
    isLoading ? <Flex justifyContent="center" alignItems="center" height="100vh">
        <Typography variant={TVariant.PresStart15}>
          Generating share image...
        </Typography>
      </Flex> :
      <>
        <Typography variant={TVariant.ComicSans18} block style={{marginBottom: "15px"}}>
          {
            `You just ${isMinted ? 'minted': 'burned'} ${AppStore.web3.updatedPuppers.length} pixels - let your friends know`
          }
        </Typography>
        <Flex justifyContent={"center"} marginBottom={"20px"}>
        <img src={image} />
        </Flex>
        <Flex justifyContent={"space-around"} width={"250px"} margin={"auto"}>
          <FacebookShareButton
            url={shareURL}
            hashtag={"#hashtag"}
            className="Demo__some-network__share-button"
          >
            <FacebookIcon size={32} round /> 
          </FacebookShareButton>
          <br />
          <TwitterShareButton
            title={"test"}
            url={shareURL}
            hashtags={["hashtag1", "hashtag2"]}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </Flex>
      </>
  }
     
  </>
})

export default SharePixelsDialog
