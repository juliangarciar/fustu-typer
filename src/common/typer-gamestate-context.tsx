import { createContext, FC, useState } from "react";
import { UsersControllerQuery } from "../api/axios-client";

export const GAME_STATE = {
    GAME_MENU: "GAME_MENU",
    GAME_LOBBY: "GAME_LOBBY",
    GAME: "GAME",
    INIT: "INIT",
};

export const GameStateContext = createContext({
    gameState: GAME_STATE.INIT,
    setGameState: (gs: string) => {},
});

export const TyperGameStateProvider: FC<React.PropsWithChildren> = ({ children }) => {
    const [gameState, setGameState] = useState(GAME_STATE.INIT);
    const { refetch } = UsersControllerQuery.useMeQuery();
    
    const updateGameState = (newGameState: string) => {
        if (newGameState === GAME_STATE.INIT) {
            localStorage.removeItem("accessToken");
            refetch();
        }

        setGameState(newGameState);
    };

    return (
        <GameStateContext.Provider value={{gameState: gameState, setGameState: updateGameState}}>
            {children}
        </GameStateContext.Provider>
    );
};