import { Box, HStack } from '@chakra-ui/react';
import { FC, useContext, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import {
  GameControllerQuery,
  LeaveGameDto,
  StartGameDto,
  UsersControllerQuery
} from '../api/axios-client';
import TyperContainer from '../common-components/typer-container';
import { TyperLoading } from '../common-components/typer-loading';
import { TyperMenuLayout } from '../common-components/typer-menu-layout';
import { TyperPlayerCard } from '../common-components/typer-player-card';
import { GameStateContext, GAME_STATE } from '../common-hooks/typer-gamestate-context';

export const TyperLobby: FC = () => {
  const { data: currentGame, refetch } = GameControllerQuery.useGetCurrentGameQuery();
  const { data: currentUser } = UsersControllerQuery.useMeQuery();
  const { gameState, setGameState } = useContext(GameStateContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      refetch();
    }, 500);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleStartGame = async (_gameId: number) => {
    await GameControllerQuery.Client.startGame(
      new StartGameDto({ gameId: _gameId }),
    );
    queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
  };

  const handleBackToMenu = async (_gameId: number) => {
    await GameControllerQuery.Client.leaveGame(
      new LeaveGameDto({ gameId: _gameId }),
    );
    queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
    setGameState(GAME_STATE.GAME_MENU);
  };

  if (!currentGame) return <TyperLoading />;

  const buttonAccept =
    currentGame?.lead.id === currentUser?.id &&
    !currentGame?.hasStarted &&
    currentUser
      ? {
          buttonName: 'Start game',
          buttonAction: () => handleStartGame(currentGame.id),
        }
      : undefined;

  return (
    <TyperContainer>
      <TyperMenuLayout
        heading={'Game lobby'}
        cancelButton={{
          buttonName: 'Back to menu',
          buttonAction: () => handleBackToMenu(currentGame.id),
        }}
        acceptButton={buttonAccept}
      >
        <HStack h="100%" spacing="5%" mx="5%" borderRadius="lg">
          {
            currentGame.participants.map((participant, index) => {
              return (
                <Box key={index} w="45%" h="80%">
                  <TyperPlayerCard
                    playerName={participant.name}
                    playerEmail={participant.email}
                    playerImg={participant.avatar}
                    playerElo={participant.rating}
                    playerGames={participant.gamesPlayed}
                    playerRankedGames={participant.rankedGamesPlayed}
                  />
                </Box>
              );
            })
          }
        </HStack>
      </TyperMenuLayout>
    </TyperContainer>
  );
};
