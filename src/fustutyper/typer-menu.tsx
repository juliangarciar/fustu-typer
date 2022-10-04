import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import React from "react"

interface TyperMenuProps {
    onStart: () => void;
    gameState: boolean;
};

const TyperMenu: React.FunctionComponent<TyperMenuProps> = ({onStart, gameState}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    React.useEffect(() => {
        gameState ? onClose() : onOpen();
    }, [gameState]);

    const startGame = () => {
        onStart();
    };

    return (
        <Modal  closeOnOverlayClick={false}
                closeOnEsc={false} 
                isOpen={isOpen} 
                onClose={onClose}
                isCentered={true}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>FuSTU Typer</ModalHeader>
                <ModalBody pb={6}>
                    Welcome to the best game in earth, the FuSTU Typer!
                </ModalBody>
        
                <ModalFooter>
                    <Button colorScheme="teal" size="lg" onClick={startGame}>
                        Play
                    </Button>
                </ModalFooter>
          </ModalContent>
        </Modal>
    );
}

export default TyperMenu;