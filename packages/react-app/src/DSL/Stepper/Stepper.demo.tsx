import React from "react";
import Demo from "../Demo/Demo";
import Stepper from "./Stepper";

const DemoStepper = () => {
  return (
    <Demo title={"Stepper"}>
      <Stepper
        items={[
          { title: "Sit", key: "sit" },
          { title: "💩", key: "title" },
          { title: "Wipe", key: "wipe" },
        ]}
        activeIndex={1}
      />
    </Demo>
  );
};

export default DemoStepper;
