import { Box, Button, Center, CircularProgress, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { FC, useContext } from "react";
import { useQueryClient } from "react-query";
import { CreateGameDto, CreateGameDtoDifficutly, CreateGameDtoGameLength, GameControllerQuery, JoinGameDto, UsersControllerQuery } from "../api/axios-client";
import { GameStateContext, GAME_STATE } from "../common/typer-gamestate-context";

export const TyperMenu: FC = () => {
    const { data: openGamesData, status } = GameControllerQuery.useGetOpenGamesQuery();
    const { logout } = useContext(GameStateContext);
    const queryClient = useQueryClient();

    if (status != "success") {
        return (
            <Center h="100vh">
                <CircularProgress isIndeterminate />
            </Center>
        );
    }

    return (
        <Box>
            <h2>Game list</h2>
            <Box pb={6}>
                <Table>
                    <Tbody>
                        {
                            openGamesData.map(openGame => {
                                return (
                                    <Tr key={openGame.id}>
                                        <Td>{openGame.title}</Td>
                                        <Td>{openGame.lead.name}</Td>
                                        <Td>{openGame.participants.length}/2</Td>
                                        <Td>
                                            <Button onClick={async () => {
                                                await GameControllerQuery.Client.joinGame(new JoinGameDto({ gameId: openGame.id }));
                                                queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
                                            }}>Join</Button>
                                        </Td>
                                    </Tr>
                                )
                            })
                        }
                    </Tbody>
                </Table>
            </Box>
            <Box>
                <Button m={6} onClick={async () => {
                    await GameControllerQuery.Client.createGame(new CreateGameDto({ title: "New Game", difficutly: CreateGameDtoDifficutly.Easy, gameLength: CreateGameDtoGameLength.Short }));
                    queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
                }}>Create Game</Button>

                <Button m={6} onClick={logout}>Logout</Button>
            </Box>
        </Box>
    );
}
