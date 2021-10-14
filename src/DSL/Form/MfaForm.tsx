import React, {useMemo} from "react";
import {Box, Flex, VStack} from "@chakra-ui/react";
import MfaFormStore from "./MfaForm.store";
import Form, {FormProps} from "./Form";
import {observer} from "mobx-react-lite";
import PasswordInput from "./PasswordInput";
import TextInput from "./TextInput";
import {required} from "./validation";
import Submit from "./Submit";
import Button, {ButtonVariant} from "../Button/Button";
import MfaVerificationError from "../../services/exceptions/mfa-verification.error";
import { t } from "@lingui/macro";

export interface MfaFormProps extends FormProps {

}

const MfaForm = observer((props: MfaFormProps) => {
    const store = useMemo(() => new MfaFormStore(), [])

    const renderMfaForm = () => {
        return <Flex justifyContent={"center"}>
            <Box maxWidth={"200px"}>
                <Form onSubmit={async (mfaData) => {
                    return new Promise((resolve, rejectMfaQuery) => {
                        const combinedData = {...store.baseData, ...mfaData}
                        store.props
                            .onSubmit(combinedData)
                            .then((response: any) => {
                                store.resolveMainQuery(response)
                                store.hideMfaForm();
                            })
                            .catch((err: any) => {
                                if (err instanceof MfaVerificationError) {
                                    rejectMfaQuery(err);
                                } else {
                                    store.rejectMainQuery(err);
                                    store.hideMfaForm();
                                }
                            })
                    })
                }}>
                    <VStack spacing={3}>
                        <PasswordInput name={"password"} placeholder={t`Password`} validate={required}/>
                        <TextInput name={"mfa_code"} placeholder={t`2FA Code`} validate={required} />
                    </VStack>
                    <Flex justifyContent={"space-around"} mt={5}>
                        <Button variant={ButtonVariant.Gray} onClick={() => {
                            store.rejectMainQuery()
                            store.hideMfaForm()
                        }}>{t`Cancel`}</Button>
                        <Submit />
                    </Flex>
                </Form>
            </Box>
        </Flex>
    }

    return <Box>
        <Box display={store.isMfaFormVisible ? "none" : "block"}>
            <Form
                {...props}
                onSubmit={async (baseData) => {
                    return new Promise((resolve, reject) => {
                        store.resolveMainQuery = resolve;
                        store.rejectMainQuery = reject;
                        store.props = props;
                        store.baseData = baseData;
                        store.isMfaFormVisible = true;
                    })
                }}
            />
        </Box>

        {store.isMfaFormVisible && <Box>
            {renderMfaForm()}
        </Box>}
    </Box>
})

export default MfaForm;
