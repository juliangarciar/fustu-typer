import { FC, useEffect, useState } from "react";
import { GameControllerQuery, UsersControllerQuery } from "./api/axios-client";
import TyperLogin from "./menu/typer-login";
import TyperMenu from "./menu/typer-menu";
import Typer from "./typer/typer";

export const GAME_STATE = {
    LOGIN: "LOGIN",
    GAME_LIST: "GAME_LIST",
    GAME_LOBBY: "GAME_LOBBY",
    GAME: "GAME",
    INIT: "INIT",
};

const Game: FC = () => {
    const [currentState, setCurrentState] = useState(GAME_STATE.INIT);
    const { data, refetch } = UsersControllerQuery.useMeQuery();
    const currentGame = GameControllerQuery.useGetCurrentGameQuery();

    useEffect(() => {
        // TODO: Extract login from game logic
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

    if (currentState === GAME_STATE.LOGIN || currentState === GAME_STATE.INIT) {
        return (
            <TyperLogin gameState={currentState} />
        );
    } else if (currentState === GAME_STATE.GAME && currentGame.data) {
        return (
            <Typer gameState={currentState} gameId={currentGame.data.id} />
        );
    } else {
        return (
            <TyperMenu gameState={currentState} />
        );
    }
}

export default Game;