import { Box, useMultiStyleConfig } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { TextInputProps } from "../Form/TextInput";
import TextField from "../TextField/TextField";
import Typography, { TVariant } from "../Typography/Typography";

interface ComboboxItem {
  value: any;
  name: string | number;
}

interface ComboboxProps extends TextInputProps {
  items: ComboboxItem[];
  onItemSelect?: (value: Pick<ComboboxItem, "value">) => void;
}

const Typeahead: React.FC<ComboboxProps> = ({ onItemSelect, items, value, onChange, ...rest }) => {
  const styles = useMultiStyleConfig("Typeahead", {});
  const [showBox, setShowBox] = useState(false);

  const inputRef = useRef<HTMLElement>();
  const boxRef = useRef<HTMLDivElement>();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        boxRef.current &&
        //@ts-ignore
        !inputRef.current.contains(event.target) &&
        //@ts-ignore
        !boxRef.current.contains(event.target)
      ) {
        setShowBox(false);
      }
      //@ts-ignore
      if (inputRef.current && inputRef.current.contains(event.target)) {
        setShowBox(true);
      }
    }

    function handleKeyPress(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowBox(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <Box position={"relative"}>
      <TextField
        value={value}
        ref={inputRef}
        onFocus={() => setShowBox(true)}
        onChange={value => onChange(value)}
        {...rest}
      />
      {showBox && items.length > 0 && value !== "" && (
        <Box ref={boxRef} __css={styles.box}>
          {items.map((item, index) => (
            <Box
              key={`${item.name}-${item.value}-${index}`}
              onClick={() => {
                onChange(item.value);
                onItemSelect && onItemSelect(item.value);
                setShowBox(false);
              }}
              __css={styles.item}
            >
              <Typography variant={TVariant.ComicSans16}>{item.name}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Typeahead;
