import { observer } from "mobx-react-lite";
import Modal from "../../DSL/Modal/Modal";
import { Box } from "@chakra-ui/react";
import PixelArtPageStore from "./PixelArtPage.store";
import { Input } from "../../DSL/Form/Input/Input";
import Button, { ButtonVariant } from "../../DSL/Button/Button";
import { useState } from "react";
import { Type } from "../../DSL/Fonts/Fonts";

interface ImportTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: PixelArtPageStore;
}

const ImportTemplateModal = observer((props: ImportTemplateModalProps) => {
  const [image, setImage] = useState("");

  const onImageUpload = (event: any) => {
    if (event.target.files.length) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const data = reader.result;
        setImage(data as string);
      };
    } else {
      setImage("");
    }
  };

  const onApply = () => {
    if (image !== "") {
      props.store.templateImage = image;
    }
    props.onClose();
  };

  const onReset = () => {
    props.store.templateImage = "";
    props.onClose();
  };

  return (
    <Modal size={"lg"} isOpen={props.isOpen} onClose={props.onClose} title={"Import Template"}>
      <Box pt={0} pb={6}>
        <Input
          fontFamily={Type.ComicSans}
          w={"full"}
          h={100}
          my={5}
          borderRadius={0}
          id="image"
          type="file"
          accept="image/*"
          onChange={onImageUpload}
        />
        {image !== "" && (
          <Box
            position={"relative"}
            w={256}
            h={256}
            mx={"auto"}
            my={5}
            backgroundImage={image}
            backgroundSize={"contain"}
            backgroundPosition={"center"}
            backgroundRepeat={"no-repeat"}
          />
        )}
        <Box display={"flex"} justifyContent={"center"}>
          <Button p={0} margin={"0 auto"} variant={ButtonVariant.Primary} onClick={onApply}>
            Apply
          </Button>
          <Button p={0} margin={"0 auto"} variant={ButtonVariant.Primary} onClick={onReset}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
});

export default ImportTemplateModal;
