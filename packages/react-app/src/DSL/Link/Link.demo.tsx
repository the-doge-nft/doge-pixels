import React from "react";
import Demo from "../Demo/Demo";
import Link from "./Link";

const DemoLink = () => {
  return (
    <Demo title={"Link"}>
      <Link to={"/dsl"}>Click me!</Link>
    </Demo>
  );
};

export default DemoLink;
