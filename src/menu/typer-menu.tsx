import { Modal, ModalOverlay, useDisclosure, UseModalProps } from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { GAME_STATE } from "../game";
import TyperGameList from "./typer-game-list";
import TyperLobby from "./typer-lobby";

const TyperMenu: FC<{gameState: string}> = ({gameState}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (gameState === GAME_STATE.GAME_LIST 
                || gameState === GAME_STATE.GAME_LOBBY  
                && !isOpen) {
            onOpen();
        } else if (gameState === GAME_STATE.GAME && isOpen) {
            onClose();
        }
    }, [gameState]);

    return (
        <Modal  closeOnOverlayClick={false} 
                closeOnEsc={false} 
                isOpen={isOpen} 
                onClose={onClose} 
                isCentered={true}>
            <ModalOverlay />
            {gameState === GAME_STATE.GAME_LIST ? <TyperGameList /> : <TyperLobby />}
        </Modal>
    );
}

export default TyperMenu;