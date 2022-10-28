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
import { GameStateContext } from '../common-hooks/typer-gamestate-context';
import { ModalContext, MODAL_TYPE } from '../common-hooks/typer-modal-context';
import { TyperMenuLayout } from '../common-components/typer-menu-layout';
import TyperContainer from '../common-components/typer-container';
import './../index.css';

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
    <TyperContainer>
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
        <Box className="game-list" overflowY="auto" h="100%" mx="5%" fontSize="md">
          <Table>
            <Tbody>
              {openGamesData.map((openGame, index) => {
                let isGray = index % 2 == 0 ? "gray.300" : "white";
                return (
                  <Tr key={openGame.id} bgColor={isGray}>
                    <Td>{openGame.title}</Td>
                    <Td>{openGame.lead.name}</Td>
                    <Td>{openGame.participants.length}/2</Td>
                    <Td>
                      <Button bg="blue.400" _hover={{ bg: "blue.500" }} color="white" onClick={() => handleJoinGame(openGame.id)}>Join</Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </TyperMenuLayout>
    </TyperContainer>
  );
};
