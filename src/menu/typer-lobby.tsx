import { Box, Button, Center, CircularProgress, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { FC, useContext, useEffect } from "react";
import { useQueryClient } from "react-query";
import { GameControllerQuery, LeaveGameDto, StartGameDto, UsersControllerQuery } from "../api/axios-client";
import { ModalContext, MODAL_TYPE } from "../modal/typer-modal-context";

export const TyperLobby: FC = () => {
    const { data: currentGame, refetch: refetchCurrentGame } = GameControllerQuery.useGetCurrentGameQuery();
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

    const handleStartGame = async (gameId: number) => {
        await GameControllerQuery.Client.startGame(new StartGameDto({ gameId: gameId }));
        queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
    }

    const handleBackToMenu = async (gameId: number) => {
        let isLeader = currentGame?.lead.id === currentUser?.id;
        await GameControllerQuery.Client.leaveGame(new LeaveGameDto({ gameId: gameId }));
        queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());

        if (!isLeader) {
            openModal(MODAL_TYPE.LOBBY_LEADER_LEFT);
        }
    }

    if (!currentGame) {
        return (
            <Center h="100vh">
                <CircularProgress isIndeterminate />
            </Center>
        );
    }

    return (
        <Box>
            <h2>{currentGame.title}</h2>
            <Box pb={6}>
                <Table>
                    <Tbody>
                        {
                            currentGame.participants.map((participant) => {
                                return (
                                    <Tr key={participant.id}>
                                        <Td>{participant.name}</Td>
                                        <Td>{participant.email}</Td>
                                    </Tr>
                                );
                            })
                        }
                    </Tbody>
                </Table>
            </Box>
            <Box>
                {
                    currentGame?.lead.id === currentUser?.id && !currentGame?.hasStarted && currentUser
                        ? <Button onClick={async () => handleStartGame(currentGame.id)}>Start</Button>
                        : <></>
                }
                <Button m={6} onClick={async () => handleBackToMenu(currentGame.id)}>Back to menu</Button>
            </Box>
        </Box>
    );
}
