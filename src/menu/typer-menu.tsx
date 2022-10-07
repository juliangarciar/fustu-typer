import { Modal, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React, { FC } from "react";
import { GAME_STATE } from "../game";
import TyperGameList from "./typer-game-list";
import TyperLobby from "./typer-lobby";

interface TyperMenuProps {
    gameState: string;
    onStart: () => void;
};

const TyperMenu: FC<TyperMenuProps> = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    React.useEffect(() => {
        if (props.gameState === GAME_STATE.GAME_LIST 
                || props.gameState === GAME_STATE.GAME_LOBBY  
                && !isOpen) {
            onOpen();
        } else if (props.gameState === GAME_STATE.GAME && isOpen) {
            onClose();
        }
    }, [props]);

    return (
        <Modal closeOnOverlayClick={false}
            closeOnEsc={false}
            isOpen={isOpen}
            onClose={onClose}
            isCentered={true}
        >
            <ModalOverlay />
            {
                props.gameState === GAME_STATE.GAME_LIST 
                    ? <TyperGameList />
                    : <TyperLobby />
            }
        </Modal>
    );
}

export default TyperMenu;