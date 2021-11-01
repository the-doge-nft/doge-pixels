import React from "react";
import Button from "../Button/Button";
import Demo from "../Demo/Demo";
import toast from "./Toast";

const DemoToast = () => {
  return (
    <Demo title={"Toast"}>
      <Button
        onClick={() =>
          toast({
            title: "🍞🍞🍞🍞",
            isClosable: true,
            description: "Time for butter",
            status: "success",
          })
        }
      >
        Success Toast
      </Button>
    </Demo>
  );
};

export default DemoToast;
