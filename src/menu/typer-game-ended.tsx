import { Box, HStack } from '@chakra-ui/react';
import { FC, useContext } from 'react';
import { useQueryClient } from 'react-query';
import { GameControllerQuery, UsersControllerQuery } from '../api/axios-client';
import TyperContainer from '../common-components/typer-container';
import { TyperLoading } from '../common-components/typer-loading';
import { TyperMenuLayout } from '../common-components/typer-menu-layout';
import { TyperPlayerCard } from '../common-components/typer-player-card';
import {
  GameStateContext,
  GAME_STATE,
} from '../common-hooks/typer-gamestate-context';

export const TyperGameEnded: FC = () => {
  const { data: lastGame } = GameControllerQuery.useGetLastGameQuery();
  const { data: currentUser } = UsersControllerQuery.useMeQuery();
  const { setGameState } = useContext(GameStateContext);
  const queryClient = useQueryClient();

  const handleBackToMenu = () => {
    queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
    setGameState(GAME_STATE.GAME_MENU);
  };

  if (!lastGame) return <TyperLoading />;

  return (
    <TyperContainer>
      <TyperMenuLayout
        heading={'Result'}
        cancelButton={{
          buttonName: 'Back to menu',
          buttonAction: () => handleBackToMenu(),
        }}
        acceptButton={undefined}
      >
        <HStack h="100%" mx="2.5%" spacing="5%">
          {lastGame.postGameUsers.map((participant, index) => {
            return (
              <Box
                key={index}
                w="47.5%"
                h="80%"
                bg={
                  lastGame?.winner.id === currentUser?.id
                    ? 'yellow.100'
                    : 'red.200'
                }
              >
                <TyperPlayerCard
                  playerName={participant.userInfo.name}
                  playerEmail={participant.userInfo.email}
                  playerImg={participant.userInfo.avatar}
                  playerElo={participant.userInfo.rating}
                  playerGames={participant.userInfo.gamesPlayed}
                  playerRankedGames={participant.userInfo.rankedGamesPlayed}
                  playerCorrectWords={participant.correctSubmissions}
                  playerIncorrectWords={participant.wrongSubmissions}
                />
              </Box>
            );
          })}
        </HStack>
      </TyperMenuLayout>
    </TyperContainer>
  );
};
