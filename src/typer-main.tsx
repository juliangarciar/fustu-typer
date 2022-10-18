import { Box, Center, CircularProgress } from "@chakra-ui/react";
import { FC, useContext, useEffect } from "react";
import { GameControllerQuery } from "./api/axios-client";
import { GameStateContext, GAME_STATE } from "./common/typer-gamestate-context";
import { TyperLogin } from "./login/typer-login";
import { TyperLobby } from "./menu/typer-lobby";
import { TyperMenu } from "./menu/typer-menu";
import { TyperGame } from "./typer/typer-game";

export const TyperMain: FC = () => {
    const {gameState, setGameState} = useContext(GameStateContext);
    const {data: currentGame, isSuccess} = GameControllerQuery.useGetCurrentGameQuery();

    useEffect(() => {
        if (isSuccess && !currentGame.id) {
            setGameState(GAME_STATE.GAME_MENU);
        } else if (currentGame?.id && !currentGame?.hasStarted) {
            setGameState(GAME_STATE.GAME_LOBBY);
        } else if (currentGame?.id && currentGame?.hasStarted) {
            setGameState(GAME_STATE.GAME);
        }
    }, [currentGame]);

    let renderElement;
    if (gameState === GAME_STATE.INIT) {
        renderElement = <Center h="100vh"><CircularProgress isIndeterminate /></Center>;
    } else if (gameState === GAME_STATE.GAME && currentGame?.id) {
        renderElement = <TyperGame gameId={currentGame.id} />;
    } else if (gameState === GAME_STATE.GAME_LOBBY) {
        renderElement = <TyperLobby />;
    } else if (gameState === GAME_STATE.GAME_MENU) {
        renderElement = <TyperMenu />;
    }

    return (
        <>
            <TyperLogin />
            <Center w="100vw" h="100vh" minWidth="800px" minHeight="600px" m="0" p="0" bg="gray.100" overflow="hidden">
                <Box w="60%" minW="800px" h="80%" m="auto" bg="white" borderRadius="lg" shadow="lg">
                    {renderElement}
                </Box>
            </Center>
        </>
    );
}