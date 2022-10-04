import { useFocusEffect } from "@chakra-ui/react";
import React from "react";
import Typer from "./fustutyper/typer";
import { MODE } from "./fustutyper/typer-config";
import TyperMenu from "./fustutyper/typer-menu";
import { getWords } from "./fustutyper/typer-service";

const Game: React.FunctionComponent = () => {
    const [currentState, setCurrentState] = React.useState(false);

    const startGame = () => {
        setCurrentState(true);
    };

    const endGame = () => {
        setCurrentState(false);
    };
    
    return (
        <>
            <TyperMenu onStart={() => startGame()} gameState={currentState} />
            <Typer words={getWords()} endGame={() => endGame()} gameState={currentState} />
        </>
    );
}

export default Game;