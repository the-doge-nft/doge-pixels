import AppStore from "../../store/App.store";
import {Box} from "@chakra-ui/react";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import Modal from "../../DSL/Modal/Modal";
import React from "react";
import {observer} from "mobx-react-lite";
import MemeModal from "../../pages/Viewer/MemeModal";

const MonaModal = observer(() => {
  return <>
    <Modal
      title={"April Fools :)"}
      onClose={() => AppStore.isAprilFoolsModalOpen = false}
      isOpen={AppStore.isAprilFoolsModalOpen}>
      <Box mt={5} textAlign={"center"}>
        <Typography variant={TVariant.ComicSans16}>
          No metadata was changed - just what you see here on the pixel portal
        </Typography>
      </Box>
    </Modal>
    <MemeModal
      isOpen={AppStore.isAprilFoolsModalOpen}
      onClose={() => AppStore.isAprilFoolsModalOpen = false}
      type={"mona"}/>
  </>
})

const MonaButton = () => {
  return <Typography
    variant={TVariant.ComicSans12}
    fontWeight={"bold"}
    _hover={{textDecoration: "underline", cursor: "pointer"}}
    _active={{transform: "translate(2px, 2px)"}}
    onClick={() => AppStore.isAprilFoolsModalOpen = true}>
    Mona??
  </Typography>
}

export {MonaButton, MonaModal}
