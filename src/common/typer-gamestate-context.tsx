import { createContext, FC, useState } from 'react';
import { UsersControllerQuery } from '../api/axios-client';

export const GAME_STATE = {
  GAME_MENU: "GAME_MENU",
  GAME_LOBBY: "GAME_LOBBY",
  GAME_LOADING: "GAME_LOADING",
  GAME_STARTED: "GAME_STARTED",
  GAME_FINISHED: "GAME_FINISHED",
  INIT: "INIT",
};

export const GameStateContext = createContext({
  gameState: GAME_STATE.INIT,
  setGameState: (gs: string) => {},
  logout: () => {},
});

export const TyperGameStateProvider: FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [gameState, setGameState] = useState(GAME_STATE.INIT);
  const { refetch } = UsersControllerQuery.useMeQuery();

  const _setGameState = (newGameState: string) => {
    setGameState(newGameState);
  };

  const _logout = () => {
    localStorage.removeItem("accessToken");
    refetch();
    setGameState(GAME_STATE.INIT);
  };

  return (
    <GameStateContext.Provider
      value={{
        gameState: gameState,
        setGameState: _setGameState,
        logout: _logout,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
