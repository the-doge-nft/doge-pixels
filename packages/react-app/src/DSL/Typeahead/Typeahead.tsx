import TextInput, {TextInputProps} from "../Form/TextInput";
import Form from "../Form/Form";
import React, {useEffect, useRef, useState} from "react";
import {Box, useMultiStyleConfig} from "@chakra-ui/react";
import Typography, {TVariant} from "../Typography/Typography";
import {arrayFuzzyFilterByKey} from "../../helpers/arrays";
import {observer} from "mobx-react-lite";

interface ComboboxItem {
    value: any;
    name: string | number
}

interface ComboboxProps extends TextInputProps {
    items: ComboboxItem[];
    onItemSelect?: (value: Pick<ComboboxItem, 'value'>) => void;
}

const Typeahead: React.FC<ComboboxProps> = observer(({onItemSelect, items, value, onChange, ...rest }) => {
    const styles = useMultiStyleConfig('Typeahead', {})
    const [showBox, setShowBox] = useState(false)
    const [filteredItems, setFilteredItems] = useState(items)

    const inputRef = useRef<HTMLElement>()
    const boxRef = useRef<HTMLDivElement>()

    useEffect(() => {
        setFilteredItems(arrayFuzzyFilterByKey(items, value, 'name'))
    }, [value])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            //@ts-ignore
            if (inputRef.current && boxRef.current && !inputRef.current.contains(event.target) && !boxRef.current.contains(event.target)) {
                setShowBox(false)
            }
            //@ts-ignore
            if (inputRef.current && inputRef.current.contains(event.target)) {
                setShowBox(true)
            }
        }

        function handleKeyPress(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setShowBox(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyPress)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [inputRef])

    return <Box position={"relative"}>
        <Form onSubmit={async () => {
        }}>
            <TextInput
                value={value}
                ref={inputRef}
                onFocus={() => setShowBox(true)}
                onChange={onChange}
                {...rest}
            />
        </Form>
        {showBox && filteredItems.length > 0 && <Box ref={boxRef} __css={styles.box}>
            {filteredItems.map(item => <Box key={`${item.name}-${item.value}`} onClick={() => {
                onChange(item.value)
                onItemSelect && onItemSelect(item.value)
                setShowBox(false)
            }} __css={styles.item}>
                <Typography variant={TVariant.ComicSans16}>{item.name}</Typography>
            </Box>)}
        </Box>}
        <div onClick={(e) => console.log(e)}/>
    </Box>
})

export default Typeahead

