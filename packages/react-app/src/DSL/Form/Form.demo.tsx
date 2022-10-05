import React, { useMemo } from "react";
import Demo from "../Demo/Demo";
import Form from "./Form";
import { Box, HStack, VStack } from "@chakra-ui/react";
import Button, { ButtonVariant } from "../Button/Button";
import TextInput from "./TextInput";
import NumberInput from "./NumberInput/NumberInput";
import { makeObservable, observable } from "mobx";
import model from "./model";
import Submit from "./Submit";
import { observer } from "mobx-react-lite";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import BigInput from "./BigInput";
import CheckboxInput from "./CheckboxInput/CheckboxInput";

class DemoFormStore {
  @observable
  controlledText: string = "test";

  @observable
  controlledNumber: string = "10";

  @observable
  bigNumberInput: string = "";

  @observable
  product: string = "USDC";

  @observable
  toggle = false;

  @observable
  check = false;

  get selectItems() {
    return [
      { id: "USDC", name: "USDC" },
      { id: "BTC", name: "BTC" },
    ];
  }

  constructor() {
    makeObservable(this);
  }
}

const DemoForm = () => {
  const store = useMemo(() => new DemoFormStore(), []);
  return (
    <Demo title={"Form"}>
      <Box px={{ base: 5, md: "20%" }}>
        <DemoBasicForm />
        <DemoTextInputForm store={store} />
        <DemoNumberInputForm store={store} />
        <DemoBigInput store={store} />
        {/*<DemoSelectInput store={store} />*/}
        {/*<ToggleDemo store={store}/>*/}
        <CheckboxDemo store={store} />
      </Box>
    </Demo>
  );
};

const DemoBasicForm = () => {
  return (
    <SubDemo title={"Basic Form"}>
      <Form onSubmit={async data => alert(JSON.stringify(data))}>
        <VStack spacing={5}>
          <TextInput name={"firstName"} label={"First Name"} placeholder={"First Name"} />
          <TextInput name={"lastName"} label={"Last Name"} placeholder={"Last Name"} />
        </VStack>
        <Submit w={"100%"} mt={4} />
      </Form>
    </SubDemo>
  );
};

const DemoTextInputForm = observer(({ store }: { store: DemoFormStore }) => {
  return (
    <SubDemo title={"Text Input"}>
      <Form onSubmit={async data => alert(JSON.stringify(data))}>
        <HStack>
          <TextInput name={"unControlledText"} label={"Uncontrolled"} />
          <TextInput {...model(store, "controlledText")} label={"Controlled"} />
        </HStack>
        <HStack mt={6}>
          <Submit w={"100%"} />
          <Button
            variant={ButtonVariant.Text}
            w={"100%"}
            onClick={() =>
              (store.controlledText = Math.random()
                .toString(36)
                .replace(/[^a-z]+/g, "")
                .substr(0, 5))
            }
          >
            change controlled
          </Button>
        </HStack>
      </Form>
    </SubDemo>
  );
});

const DemoNumberInputForm = observer(({ store }: { store: DemoFormStore }) => {
  return (
    <SubDemo title={"Number Input"}>
      <Form onSubmit={async data => alert(JSON.stringify(data))}>
        <HStack>
          <NumberInput name={"unControlledNumber"} label={"Uncontrolled"} />
          <NumberInput {...model(store, "controlledNumber")} label={"Controlled"} />
        </HStack>
        <HStack mt={6}>
          <Submit w={"100%"} />
          <Button
            w={"100%"}
            variant={ButtonVariant.Text}
            onClick={() => (store.controlledNumber = Math.round(Math.random() * 10).toString())}
          >
            change controlled
          </Button>
        </HStack>
      </Form>
    </SubDemo>
  );
});

// const DemoSelectInput = observer(({ store }: { store: DemoFormStore }) => {
//   return (
//     <SubDemo title={"Select Input"}>
//       <Form onSubmit={async data => alert(JSON.stringify(data))}>
//         <HStack spacing={2}>
//           <TextInput name={"test"} />
//           <SelectInput items={store.selectItems} {...model(store, "product")} />
//         </HStack>
//         <Submit w={"100%"} mt={3} />
//       </Form>
//     </SubDemo>
//   );
// });

const DemoBigInput = observer(({ store }: { store: DemoFormStore }) => {
  return (
    <SubDemo title={"Big Input"}>
      <Form onSubmit={async data => alert(JSON.stringify(data))}>
        <BigInput label={"PX"} store={store} storeKey={"bigNumberInput"} />
        <Submit w={"100%"} mt={3} />
      </Form>
    </SubDemo>
  );
});

// const ToggleDemo = observer(({ store }: { store: DemoFormStore }) => {
//   return (
//     <SubDemo title={"Toggle Input"}>
//       <Form onSubmit={async data => alert(JSON.stringify(data))}>
//         <ToggleInput name={"toggle_uncontrolled"} />
//         <ToggleInput {...model(store, "toggle")} />
//         <HStack mt={6}>
//           <Submit w={"100%"} />
//           <Button w={"100%"} variant={ButtonVariant.Text} onClick={() => (store.toggle = !store.toggle)}>
//             change controlled
//           </Button>
//         </HStack>
//       </Form>
//     </SubDemo>
//   );
// });

const CheckboxDemo = observer(({ store }: { store: DemoFormStore }) => {
  return (
    <SubDemo title={"Checkbox Input"}>
      <Form onSubmit={async data => alert(JSON.stringify(data))}>
        <CheckboxInput name={"check_uncontrolled"} />
        <CheckboxInput {...model(store, "check")} />

        <HStack mt={6}>
          <Submit w={"100%"} />
          <Button w={"100%"} variant={ButtonVariant.Text} onClick={() => (store.check = !store.check)}>
            change controlled
          </Button>
        </HStack>
      </Form>
    </SubDemo>
  );
});

export const SubDemo = ({ title, children }: { title: string; children: any }) => {
  return (
    <Box w={"100%"} mt={20}>
      <Box>
        <Typography variant={TVariant.PresStart24} color={"gray.400"} block mb={3}>
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );
};

export default DemoForm;
