import { Box, Center, CircularProgress, HStack } from '@chakra-ui/react';
import { FC, useContext, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import {
  GameControllerQuery,
  LeaveGameDto,
  StartGameDto,
  UsersControllerQuery,
} from '../api/axios-client';
import { TyperLoading } from '../common/components/typer-loading';
import { ModalContext, MODAL_TYPE } from '../modal/typer-modal-context';
import { TyperMenuLayout } from './typer-menu-layout';
import { TyperPlayerCard } from './typer-player-card';

export const TyperLobby: FC = () => {
  const { data: currentGame, refetch: refetchCurrentGame } =
    GameControllerQuery.useGetCurrentGameQuery();
  const { data: currentUser } = UsersControllerQuery.useMeQuery();
  const queryClient = useQueryClient();
  const { openModal } = useContext(ModalContext);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      refetchCurrentGame();
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
    let isLeader = currentGame?.lead.id === currentUser?.id;
    await GameControllerQuery.Client.leaveGame(
      new LeaveGameDto({ gameId: _gameId }),
    );
    queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());

    if (!isLeader) {
      openModal(MODAL_TYPE.LOBBY_LEADER_LEFT);
    }
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
    <TyperMenuLayout
      heading={'Game lobby'}
      cancelButton={{
        buttonName: 'Back to menu',
        buttonAction: () => handleBackToMenu(currentGame.id),
      }}
      acceptButton={buttonAccept}
    >
      <HStack h="100%" mx="2.5%" spacing="5%">
        {currentGame.participants.map((participant, index) => {
          return (
            <Box key={index} w="47.5%" h="80%">
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
        })}
      </HStack>
    </TyperMenuLayout>
  );
};
