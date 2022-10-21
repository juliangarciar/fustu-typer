import {
  Box,
  Button, Table,
  Tbody,
  Td,
  Tr
} from '@chakra-ui/react';
import { FC, useContext, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { GameControllerQuery, JoinGameDto } from '../api/axios-client';
import { TyperLoading } from '../common-components/typer-loading';
import { GameStateContext, GAME_STATE } from '../common-hooks/typer-gamestate-context';
import { ModalContext, MODAL_TYPE } from '../common-hooks/typer-modal-context';
import { TyperMenuLayout } from '../common-components/typer-menu-layout';

export const TyperMenu: FC = () => {
  const { data: openGamesData, status, refetch: refetchCurrentGames } = GameControllerQuery.useGetOpenGamesQuery();
  const { logout } = useContext(GameStateContext);
  const { openModal } = useContext(ModalContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      refetchCurrentGames();
    }, 500);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleCreateGame = async () => {
    openModal(MODAL_TYPE.CREATE_GAME);
  };

  const handleJoinGame = async (_gameId: number) => {
    await GameControllerQuery.Client.joinGame(
      new JoinGameDto({
        gameId: _gameId,
      }),
    );
    queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
  };

  if (status != 'success') return <TyperLoading />;

  return (
    <TyperMenuLayout
      heading={'Game list'}
      cancelButton={{
        buttonName: 'Logout',
        buttonAction: logout,
      }}
      acceptButton={{
        buttonName: 'Create game',
        buttonAction: handleCreateGame,
      }}
    >
      <Box bg="blue.200" overflowY="auto">
        <Table>
          <Tbody>
            {openGamesData.map((openGame) => {
              return (
                <Tr key={openGame.id}>
                  <Td>{openGame.title}</Td>
                  <Td>{openGame.lead.name}</Td>
                  <Td>{openGame.participants.length}/2</Td>
                  <Td>
                    <Button onClick={() => handleJoinGame(openGame.id)}>Join</Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </TyperMenuLayout>
  );
};
