import {
  Box,
  Button,
  Center,
  CircularProgress,
  Table,
  Tbody,
  Td,
  Tr,
} from '@chakra-ui/react';
import { FC, useContext } from 'react';
import { useQueryClient } from 'react-query';
import { GameControllerQuery, JoinGameDto } from '../api/axios-client';
import { GameStateContext } from '../common/typer-gamestate-context';
import { ModalContext, MODAL_TYPE } from '../modal/typer-modal-context';
import { TyperMenuLayout } from './typer-menu-layout';

export const TyperMenu: FC = () => {
  const { data: openGamesData, status } =
    GameControllerQuery.useGetOpenGamesQuery();
  const { logout } = useContext(GameStateContext);
  const { openModal } = useContext(ModalContext);
  const queryClient = useQueryClient();

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

  if (status != 'success') {
    return (
      <Center h="100vh">
        <CircularProgress isIndeterminate />
      </Center>
    );
  }

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
      <Box maxH="100%" mx="2.5%" bg="blue.200" overflowY="auto">
        <Table>
          <Tbody>
            {openGamesData.map((openGame) => {
              return (
                <Tr key={openGame.id}>
                  <Td>{openGame.title}</Td>
                  <Td>{openGame.lead.name}</Td>
                  <Td>{openGame.participants.length}/2</Td>
                  <Td>
                    <Button onClick={() => handleJoinGame}>Join</Button>
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
