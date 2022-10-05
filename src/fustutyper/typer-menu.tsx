import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, FormControl, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import React, { useState } from "react"
import { useQueryClient, useQueryErrorResetBoundary } from "react-query";
import { AuthControllerClient, AuthControllerQuery, GameControllerClient, GameControllerQuery, LoginDto, RegisterDto, setBaseUrl, UsersControllerQuery } from "../api/axios-client";

interface TyperMenuProps {
    onStart: () => void;
    gameState: boolean;
};

const TyperMenu: React.FunctionComponent<TyperMenuProps> = ({ onStart, gameState }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    React.useEffect(() => {
        gameState ? onClose() : onOpen();
    }, [gameState]);

    const startGame = () => {
        onStart();
    };

    const [formData, setFormData] = useState({ email: "", password: "" });

    const { data, refetch } = UsersControllerQuery.useMeQuery();
    const queryClient = useQueryClient();

    if (!data?.email) {
        return <Modal closeOnOverlayClick={false}
            closeOnEsc={false}
            isOpen={isOpen}
            onClose={onClose}
            isCentered={true}>
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

                                const result = await AuthControllerQuery.Client.login(new LoginDto({ ...formData }));
                                localStorage.setItem("accessToken", result.accessToken);
                                setFormData({ email: "", password: "" });
                                refetch();
                            } catch (e) {
                                await AuthControllerQuery.Client.register(new RegisterDto({ ...formData, name: "Noname" }));
                                const loginResult = await AuthControllerQuery.Client.login(new LoginDto({ ...formData }));
                                localStorage.setItem("accessToken", loginResult.accessToken);
                                setFormData({ email: "", password: "" });
                                refetch();
                            }
                        }}
                    >
                        Login/Register
                    </Button>

                </ModalBody>
            </ModalContent>
        </Modal>
    }


    return (
        <Modal closeOnOverlayClick={false}
            closeOnEsc={false}
            isOpen={isOpen}
            onClose={onClose}
            isCentered={true}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Hello {data.name}, welcome to FuSTU Typer</ModalHeader>
                <ModalBody pb={6}>
                    Welcome to the best game in earth, the FuSTU Typer!
                </ModalBody>

                <ModalFooter>
                    <Button m={6} onClick={() => {
                        localStorage.removeItem("accessToken");
                        refetch();
                    }}>
                        Logout
                    </Button>
                    <Button colorScheme="teal" size="lg" onClick={startGame}>
                        Play
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default TyperMenu;