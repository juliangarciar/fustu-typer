import { createContext, FC, useState } from 'react';
import TyperCreateGameModal from '../modal/typer-create-game-modal';
import { TyperLobbyQuitModal } from '../modal/typer-lobby-quit';

export const MODAL_TYPE = {
  LOBBY_LEADER_LEFT: 'LOBBY_LEADER_LEFT',
  CREATE_GAME: 'CREATE_GAME',
};

export const ModalContext = createContext({
  openModal: (MODAL_TYPE: string) => {},
});

export const ModalContextProvider: FC<React.PropsWithChildren> = ({
  children,
}) => {
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
      <TyperLobbyQuitModal registerModal={_registerModal} />
      <TyperCreateGameModal registerModal={_registerModal} />
      {children}
    </ModalContext.Provider>
  );
};

export type RegisterModal = (MODAL_TYPE: string, onOpen: () => void) => void;
