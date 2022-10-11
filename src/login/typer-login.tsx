import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { AuthControllerQuery, GameControllerQuery, LoginDto, RegisterDto, UsersControllerQuery } from "../api/axios-client";

declare global {
    const google: typeof import('google-one-tap');
}

export const TyperLogin: FC = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data, refetch } = UsersControllerQuery.useMeQuery();
    const queryClient = useQueryClient();
    
    useEffect(() => {
        if (!data?.email) {
            onOpen();
        } else {
            onClose();
        }
    }, [data]);

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: "1001740339512-uq8ofj3bap5qlu79hnkoci149ep7lq1b.apps.googleusercontent.com",
            callback: (response) => { console.log(response); }
        });
        google.accounts.id.prompt();
    }, []);

    const login = async () => {
        const result = await AuthControllerQuery.Client.login(new LoginDto({ ...formData }));
        localStorage.setItem("accessToken", result.accessToken);
        setFormData({ email: "", password: "" });
        refetch();

        queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
    };

    const register = async () => {
        AuthControllerQuery.Client.register(new RegisterDto({ ...formData, name: "Noname" }));
        const loginResult = await AuthControllerQuery.Client.login(new LoginDto({ ...formData }));
        localStorage.setItem("accessToken", loginResult.accessToken);
        setFormData({ email: "", password: "" });
        refetch();
    };

    return (
        <Modal closeOnOverlayClick={false}
            closeOnEsc={false}
            isOpen={isOpen}
            onClose={onClose}
            isCentered={true}
            size="sm"
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Welcome to FuSTU Typer
                </ModalHeader>
                <ModalBody pb={4}>
                    <FormControl>
                        <FormLabel hidden={true}>E-Mail</FormLabel>
                        <Input type="email" value={formData.email} placeholder="E-Mail" onChange={
                            (e) => { setFormData((f) => { return { ...f, email: e.target.value } }) }} />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel hidden={true}>Password</FormLabel>
                        <Input type="password" value={formData.password} placeholder="Password" onChange={
                            (e) => { setFormData((f) => { return { ...f, password: e.target.value } }) }} />
                    </FormControl>
                    <Button
                        mt={4}
                        colorScheme='teal'
                        float="right"
                        onClick={async () => {
                            try {
                                await login();
                            } catch (e) {
                                await register();
                            }
                        }}
                    >
                        Login/Register
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}