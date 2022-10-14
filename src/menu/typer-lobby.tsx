import { Box, Button, Center, CircularProgress, Container, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { FC, useContext } from "react";
import { useQueryClient } from "react-query";
import { GameControllerQuery, StartGameDto, UsersControllerQuery } from "../api/axios-client";
import { GameStateContext, GAME_STATE } from "../common/typer-gamestate-context";

export const TyperLobby: FC = () => {
    const { data: currentGame } = GameControllerQuery.useGetCurrentGameQuery();
    const { data: currentUser } = UsersControllerQuery.useMeQuery();
    const { logout } = useContext(GameStateContext);
    const queryClient = useQueryClient();

    const handleStartGame = async (gameId: number) => {
        await GameControllerQuery.Client.startGame(new StartGameDto({ gameId: gameId }));
        queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
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
                <Button m={6} onClick={logout}>Logout</Button>
            </Box>
        </Box>
    );
}
