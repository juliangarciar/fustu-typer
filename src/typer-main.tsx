import { Box, Center } from '@chakra-ui/react';
import { FC, useContext, useEffect } from 'react';
import { GameControllerQuery } from './api/axios-client';
import { TyperLoading } from './common-components/typer-loading';
import { GameStateContext, GAME_STATE } from './common-hooks/typer-gamestate-context';
import { TyperLogin } from './login/typer-login';
import { TyperLobby } from './menu/typer-lobby';
import { TyperMenu } from './menu/typer-menu';
import { TyperGame } from './typer/typer-game';
import { TyperGameEnded } from './menu/typer-game-ended';
import { TyperGameLoading } from './menu/typer-game-loading';

export const TyperMain: FC = () => {
  const { data: currentGame } = GameControllerQuery.useGetCurrentGameQuery();
  const { gameState, setGameState } = useContext(GameStateContext);

  useEffect(() => {
    if (!currentGame || !currentGame.id) {
      if (gameState === GAME_STATE.GAME_STARTED) {
        setGameState(GAME_STATE.GAME_FINISHED);
      } else if (gameState === GAME_STATE.INIT) {
        setGameState(GAME_STATE.GAME_MENU);
      }
    } else if (currentGame.hasStarted === false) {
      setGameState(GAME_STATE.GAME_LOBBY);
    } else if (0 < getLoadingTime()) {
      setGameState(GAME_STATE.GAME_LOADING);
    } else if (currentGame.hasFinished === false) {
      setGameState(GAME_STATE.GAME_STARTED);
    }
  }, [currentGame]);

  useEffect(() => {
    console.log(gameState);
  }, [gameState]);

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
