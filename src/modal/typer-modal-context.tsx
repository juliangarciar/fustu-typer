import { createContext, FC, useState } from "react";
import { TyperLobbyQuit } from "./typer-lobby-quit";

export const MODAL_TYPE = {
    LOBBY_LEADER_LEFT: "LOBBY_LEADER_LEFT",
};

export const ModalContext = createContext({
    openModal: (MODAL_TYPE: string) => {}
});

export const ModalContextProvider: FC<React.PropsWithChildren> = ({ children }) => {
    const [modalMap, setModalMap] = useState(new Map<String, () => void>());

    const _openModal = (MODAL_TYPE: string) => {
        if (modalMap.has(MODAL_TYPE)) {
            modalMap.get(MODAL_TYPE)?.();
        }
    };

    const _registerModal = (MODAL_TYPE: string, isOpen: () => void): void => {
        setModalMap(new Map(modalMap.set(MODAL_TYPE, isOpen)));
    };

    return (
        <ModalContext.Provider value={{ openModal: _openModal }}>
            <TyperLobbyQuit registerModal={_registerModal} />
            { children }
        </ModalContext.Provider>
    );
};
