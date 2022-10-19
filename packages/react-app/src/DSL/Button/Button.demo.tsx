import React from "react";
import Button, { ButtonVariant } from "./Button";
import Demo from "../Demo/Demo";
import { Box } from "@chakra-ui/react";
import { SubDemo } from "../Form/Form.demo";
import { observer } from "mobx-react-lite";

const DemoButton = observer(() => {
  return (
    <Demo title={"Button"}>
      <Box mb={8}>
        <SubDemo title={"Primary"}>
          <Button size={"sm"}>sm</Button>
        </SubDemo>
        <SubDemo title={"Text"}>
          <Button variant={ButtonVariant.Text} size={"sm"}>
            sm
          </Button>
        </SubDemo>
      </Box>
    </Demo>
  );
});

export default DemoButton;
