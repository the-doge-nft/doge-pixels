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
    const [imageBase64, setImageBase64] = useState('');
    const [imageWidth, setImageWidth] = useState(0);
    const [imageHeight, setImageHeight] = useState(0);
    const [image] = useState(new Image());

    const onImageUpload = (event: any) => {
        if (event.target.files.length) {
            let file = event.target.files[0];
            let imgURL = URL.createObjectURL(file);
            image.src = imgURL;
            image.onload = () => {
                setImageWidth(image.width);
                setImageHeight(image.height);
                setImageBase64(imgURL);
            }
        } else {
            setImageBase64('');
        }
    }

    const onApply = () => {
        if (imageBase64 !== '') {
            let sticker = new Sticker();
            sticker.imageBase64 = imageBase64;
            sticker.width = imageWidth;
            sticker.height = imageHeight;
            sticker.image = image;
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
        title={'Import Sticker'}
    >
        <Box pt={0} pb={6}>
            <Input
                w={'full'}
                h={100}
                my={5}
                borderRadius={0}
                id="image"
                type="file"
                accept="image/*"
                onChange={onImageUpload}
            />
            {imageBase64 !== '' && <Box
                position={'relative'}
                w={256}
                h={256}
                mx={'auto'}
                my={5}
                backgroundImage={imageBase64}
                backgroundSize={'contain'}
                backgroundPosition={'center'}
                backgroundRepeat={'no-repeat'}
            />}
            <Box
                display={'flex'}
                justifyContent={'center'}
            >
                <Button p={0} margin={'0 auto'} variant={ButtonVariant.Primary} onClick={onApply}>Apply</Button>
                <Button p={0} margin={'0 auto'} variant={ButtonVariant.Primary} onClick={onReset}>Cancel</Button>
            </Box>
        </Box>
    </Modal>
})

export default ImportStickerModal
