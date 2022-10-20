import { Box, Center, CircularProgress } from '@chakra-ui/react';
import { FC, useContext, useEffect } from 'react';
import { GameControllerQuery } from './api/axios-client';
import { TyperLoading } from './common/components/typer-loading';
import { GameStateContext, GAME_STATE } from './common/typer-gamestate-context';
import { TyperLogin } from './login/typer-login';
import { TyperLobby } from './menu/typer-lobby';
import { TyperMenu } from './menu/typer-menu';
import { TyperGame } from './typer/typer-game';
import { TyperGameEnded } from './typer/typer-game-ended';
import { TyperGameLoading } from './typer/typer-game-loading';

export const TyperMain: FC = () => {
  const { gameState, setGameState } = useContext(GameStateContext);
  const { data: currentGame} = GameControllerQuery.useGetCurrentGameQuery();

  useEffect(() => {
    if (!currentGame?.id) {
      setGameState(GAME_STATE.GAME_MENU);
    } else if (!currentGame.hasStarted) {
      setGameState(GAME_STATE.GAME_LOBBY);
    } else if (0 < getLoadingTime()) {
      setGameState(GAME_STATE.GAME_LOADING);
    } else if (!currentGame.hasFinished) {
      setGameState(GAME_STATE.GAME_STARTED);
    } else {
      setGameState(GAME_STATE.GAME_FINISHED);
    }
  }, [currentGame]);

  const getLoadingTime = () => {
    if (!currentGame) {
      return -1;
    }
    
    return -(new Date().valueOf() - currentGame.startedTimestamp);
  }

  let renderElement;
  if (gameState === GAME_STATE.INIT) {
    renderElement = <TyperLoading />;
  } else if (gameState === GAME_STATE.GAME_MENU) {
    renderElement = <TyperMenu />;
  } else if (gameState === GAME_STATE.GAME_LOBBY) {
    renderElement = <TyperLobby />;
  } else if (gameState === GAME_STATE.GAME_LOADING) {
    renderElement = <TyperGameLoading duration={getLoadingTime()}/>
  } else if (gameState === GAME_STATE.GAME_STARTED && currentGame?.id) {
    renderElement = <TyperGame gameId={currentGame.id} />;
  } else if (gameState === GAME_STATE.GAME_FINISHED) {
    renderElement = <TyperGameEnded />;
  }

  return (
    <>
      <TyperLogin />
      <Center w="100vw" h="100vh" minW="800px" minH="600px" m="0" p="0" bg="gray.100" overflow="hidden">
        <Box w="60%" h="80%" minW="800px" m="auto" bg="white" borderRadius="lg" shadow="lg">
          {renderElement}
        </Box>
      </Center>
    </>
  );
};
