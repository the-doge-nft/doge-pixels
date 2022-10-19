import Demo from "../Demo/Demo";
import Typeahead from "./Typeahead";
import { useState } from "react";

const items = [
  { value: "test", name: "test" },
  { value: "thing", name: "great" },
  { value: "thing", name: "great" },
  { value: "thing", name: "great" },
  { value: "thing", name: "great" },
  { value: "thing", name: "great" },
  { value: "thing", name: "great" },
  { value: "thing", name: "great" },
  { value: "thing", name: "great" },
  { value: "thing", name: "great" },
  { value: "thing", name: "great" },
  { value: "thing", name: "great" },
  { value: "thing", name: "great" },
  { value: "thing", name: "great" },
  { value: "thing", name: "great" },
  { value: "thing", name: "great" },
];

const TypeaheadDemo = () => {
  const [value, setValue] = useState("");

  return (
    <Demo title={"Typeahead"}>
      <Typeahead items={items} name={"testcombobox"} value={value} onChange={setValue} />
    </Demo>
  );
};

export default TypeaheadDemo;
