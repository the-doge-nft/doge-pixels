import { observer } from "mobx-react-lite";
import Modal from "../../../DSL/Modal/Modal";
import { Box } from "@chakra-ui/react";
import PixelArtPageStore from "../PixelArtPage.store";
import { Input } from "../../../DSL/Form/Input/Input";
import Button, { ButtonVariant } from "../../../DSL/Button/Button";
import { useState } from "react";

interface ImportTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    store: PixelArtPageStore;
}

const ImportTemplateModal = observer((props: ImportTemplateModalProps) => {
    const [image, setImage] = useState('');

    const onImageUpload = (event: any) => {
        if (event.target.files.length) {
            let img = event.target.files[0];
            setImage(URL.createObjectURL(img));
        } else {
            setImage('');
        }
    }

    const onApply = () => {
        if (image !== '') {
            props.store.templateImage = image;
        }
        props.onClose();
    }

    const onReset = () => {
        props.store.templateImage = '';
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

export default ImportTemplateModal
