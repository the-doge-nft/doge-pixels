import React from "react";
import { Box } from "@chakra-ui/react";
import Typography, { TVariant } from "../DSL/Typography/Typography";
import DemoButton from "../DSL/Button/Button.demo";
import DemoModal from "../DSL/Modal/Modal.demo";
import DemoColors from "../DSL/Colors/Colors.demo";
import DemoToast from "../DSL/Toast/Toast.demo";
import DemoColorModeToggle from "../DSL/ColorModeToggle/ColorModeToggle.demo";
import DemoForm from "../DSL/Form/Form.demo";
import DemoLoading from "../DSL/Loading/Loading.demo";
import DemoPixelPane from "../DSL/PixelPane/PixelPane.demo";
import DemoPill from "../DSL/Pill/Pill.demo";
import DemoLink from "../DSL/Link/Link.demo";
import DemoDrawer from "../DSL/Drawer/Drawer.demo";
import DemoSelect from "../DSL/Select/Select.demo";
import DemoParkPixels from "../DSL/PixelPreview/PixelPreview.demo";
import TooltipDemo from "../DSL/Tooltip/Tooltip.demo";
import DemoCombobox from "../DSL/Typeahead/Typeahead.demo";
import DemoBottomSheet from "../DSL/BottomSheet/BottomSheet.demo";

const DSLPage = () => {
  return (
    <Box px={{ lg: 350, sm: 50 }} mb={20}>
      <Box textAlign={"center"}>
        <Typography variant={TVariant.PresStart28} block mb={7}>
          ✨ DSL ✨
        </Typography>
        <DemoBottomSheet />
        <DemoCombobox />
        <DemoParkPixels />
        <TooltipDemo />
        <DemoSelect />
        <DemoDrawer />
        <DemoLink />
        <DemoPill />
        <DemoPixelPane />
        <DemoLoading />
        <DemoButton />
        <DemoModal />
        <DemoColors />
        <DemoToast />
        <DemoColorModeToggle />
        <DemoForm />
      </Box>
    </Box>
  );
};

export default DSLPage;
