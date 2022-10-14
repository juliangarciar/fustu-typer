import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
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
        if (data?.email == null || data?.email == undefined) {
            if (!isOpen) onOpen();
        } else if (isOpen) {
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

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;

        setFormData((formData) => ({...formData, [name]: value}));
    };

    const login = async () => {
        const result = await AuthControllerQuery.Client.login(new LoginDto({ ...formData }));
        localStorage.setItem("accessToken", result.accessToken);
        setFormData({ email: "", password: "" });
        refetch();

        queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
    };

    const register = async () => {
        await AuthControllerQuery.Client.register(new RegisterDto({ ...formData, name: "Noname" }));
        await login();
    };

    return (
        <Modal  closeOnOverlayClick={false}
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
                        <Input name="email" type="email" value={formData.email} placeholder="E-Mail" onChange={handleInputChange}/>
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel hidden={true}>Password</FormLabel>
                        <Input name="password" type="password" value={formData.password} placeholder="Password" onChange={handleInputChange}/>
                    </FormControl>
                    
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="teal" onClick={async () => {
                        try {
                            await login();
                        } catch (e) {
                            await register();
                        }
                    }}>
                        Login/Register
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}