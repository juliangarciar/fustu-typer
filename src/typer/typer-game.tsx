import { FC, useEffect, useState } from "react";
import { GameControllerQuery } from "../api/axios-client";
import { TyperMenu } from "../menu/typer-menu";
import { Typer } from "./typer";

export const GAME_STATE = {
    GAME_LIST: "GAME_LIST",
    GAME_LOBBY: "GAME_LOBBY",
    GAME: "GAME",
    INIT: "INIT",
};

export const TyperGame: FC = () => {
    const [currentState, setCurrentState] = useState(GAME_STATE.INIT);
    const currentGame = GameControllerQuery.useGetCurrentGameQuery();

    useEffect(() => {
        if (!currentGame.data?.id) {
            setCurrentState((currentState) => currentState = GAME_STATE.GAME_LIST);
        } else if (currentGame.data?.id && !currentGame.data?.hasStarted) {
            setCurrentState((currentState) => currentState = GAME_STATE.GAME_LOBBY);
        } else if (currentGame.data?.id && currentGame.data?.hasStarted) {
            setCurrentState((currentState) => currentState = GAME_STATE.GAME);
        }

        console.log(currentState);
    }, [currentGame]);
    
    if (currentState === GAME_STATE.GAME && currentGame.data) {
        return (
            <Typer gameId={currentGame.data.id} />
        );
    } else {
        return (
            <TyperMenu gameState={currentState} />
        );
    }
}
