import React, { useEffect } from "react";
import { GameControllerQuery, UsersControllerQuery } from "./api/axios-client";
import TyperLogin from "./menu/typer-login";
import TyperMenu from "./menu/typer-menu";
import Typer from "./typer/typer";
import { getWords } from "./typer/typer-service";

export const GAME_STATE = {
    LOGIN: "LOGIN",
    GAME_LIST: "GAME_LIST",
    GAME_LOBBY: "GAME_LOBBY",
    GAME: "GAME",
    INIT: "INIT",
};

const Game: React.FunctionComponent = () => {
    const [currentState, setCurrentState] = React.useState(GAME_STATE.INIT);
    const { data, refetch } = UsersControllerQuery.useMeQuery();
    const currentGame = GameControllerQuery.useGetCurrentGameQuery();

    useEffect(() => {
        if (!data?.email) {
            setCurrentState((currentState) => currentState = GAME_STATE.LOGIN);
        } else if (!currentGame.data?.id) {
            setCurrentState((currentState) => currentState = GAME_STATE.GAME_LIST);
        } else if (currentGame.data?.id && !currentGame.data?.hasStarted) {
            setCurrentState((currentState) => currentState = GAME_STATE.GAME_LOBBY);
        } else if (currentGame.data?.id && currentGame.data?.hasStarted) {
            setCurrentState((currentState) => currentState = GAME_STATE.GAME);
        }

        console.log(currentState);
    }, [currentGame, data]);

    const startGame = () => {
        // setCurrentState(true);
    };

    const endGame = () => {
        // setCurrentState(false);
    };

    if (currentState === GAME_STATE.LOGIN || currentState === GAME_STATE.INIT) {
        return (
            <TyperLogin gameState={currentState} />
        );
    } else if (currentState === GAME_STATE.GAME) {
        return (
            <Typer words={getWords()} endGame={() => endGame()} gameState={currentState} />
        );
    } else {
        return (
            <TyperMenu gameState={currentState} onStart={startGame}/>
        );
    }
}

export default Game;