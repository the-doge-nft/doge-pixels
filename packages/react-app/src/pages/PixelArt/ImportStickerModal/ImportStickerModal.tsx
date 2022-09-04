import { observer } from "mobx-react-lite";
import Modal from "../../../DSL/Modal/Modal";
import { Box } from "@chakra-ui/react";
import PixelArtPageStore, { Sticker } from "../PixelArtPage.store";
import { Input } from "../../../DSL/Form/Input/Input";
import Button, { ButtonVariant } from "../../../DSL/Button/Button";
import { useState } from "react";
import { AddStickerAction } from "../PixelArtActions";

interface ImportStickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    store: PixelArtPageStore;
}

const ImportStickerModal = observer((props: ImportStickerModalProps) => {
    const [image, setImage] = useState('');
    const [imageWidth, setImageWidth] = useState(0);
    const [imageHeight, setImageHeight] = useState(0);

    const onImageUpload = (event: any) => {
        if (event.target.files.length) {
            let img = event.target.files[0];
            let imgSrc = URL.createObjectURL(img);
            let imageControl = new Image();
            imageControl.src = imgSrc;
            imageControl.onload = () => {
                setImageWidth(imageControl.width);
                setImageHeight(imageControl.height);
                setImage(imgSrc);
            }
        } else {
            setImage('');
        }
    }

    const onApply = () => {
        if (image !== '') {
            let sticker = new Sticker();
            sticker.image = image;
            sticker.width = imageWidth;
            sticker.height = imageHeight;
            props.store.stickers.push(sticker);
            props.store.pushAction(new AddStickerAction(sticker));
        }
        props.onClose();
    }

    const onReset = () => {
        props.onClose();
    }

    return <Modal
        size={"lg"}
        isOpen={props.isOpen}
        onClose={props.onClose}
        title={'Import Template'}
        description={'Upload Image as Template'}
    >
        <Box pt={0} pb={6}>
            <Input
                w={'full'}
                h={100}
                id="image"
                type="file"
                accept="image/*"
                onChange={onImageUpload}
            />
            <Button p={0} variant={ButtonVariant.Primary} onClick={onApply}>Apply</Button>
            <Button p={0} variant={ButtonVariant.Primary} onClick={onReset}>Reset</Button>
        </Box>
    </Modal>
})

export default ImportStickerModal
