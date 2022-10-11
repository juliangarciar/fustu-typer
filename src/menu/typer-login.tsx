import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React, { FC } from "react";
import { useQueryClient } from "react-query";
import { AuthControllerQuery, GameControllerQuery, GoogleTokenDto, LoginDto, RegisterDto, UsersControllerQuery } from "../api/axios-client";
import { GAME_STATE } from "../game";

interface TyperLoginProps {
    gameState: string;
};

declare global {
    const google: typeof import('google-one-tap');
}

const TyperLogin: FC<TyperLoginProps> = (props) => {
    const [formData, setFormData] = React.useState({ email: "", password: "" });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data, refetch } = UsersControllerQuery.useMeQuery();
    const queryClient = useQueryClient();

    React.useEffect(() => {
        if (props.gameState === GAME_STATE.LOGIN && !isOpen) {
            onOpen();
        } else if (props.gameState !== GAME_STATE.LOGIN && isOpen) {
            onClose();
        }
    }, [props.gameState]);

    React.useEffect(() => {
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
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Welcome to FuSTU Typer
                </ModalHeader>
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>E-Mail</FormLabel>
                        <Input type="email" value={formData.email} onChange={
                            (e) => { setFormData((f) => { return { ...f, email: e.target.value } }) }} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" value={formData.password} onChange={
                            (e) => { setFormData((f) => { return { ...f, password: e.target.value } }) }} />
                    </FormControl>
                    <Button
                        mt={4}
                        colorScheme='teal'
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

export default TyperLogin;