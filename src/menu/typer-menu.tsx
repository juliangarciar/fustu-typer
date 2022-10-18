import { Box, Button, Center, CircularProgress, Heading, Table, Tbody, Td, Tr, VStack } from "@chakra-ui/react";
import { FC, useContext } from "react";
import { useQueryClient } from "react-query";
import { CreateGameDto, CreateGameDtoDifficutly, CreateGameDtoGameLength, GameControllerQuery, GameDto, GameDtoDifficulty, GameDtoGameLength, JoinGameDto, UserDto, UsersControllerQuery } from "../api/axios-client";
import { GameStateContext, GAME_STATE } from "../common/typer-gamestate-context";
import { TyperMenuLayout } from "./typer-menu-layout";

export const TyperMenu: FC = () => {
    const { data: openGamesData, status } = GameControllerQuery.useGetOpenGamesQuery();
    const { logout } = useContext(GameStateContext);
    const queryClient = useQueryClient();

    const handleCreateGame = async () => {
        await GameControllerQuery.Client.createGame(new CreateGameDto({ 
            title: "New Game", 
            difficutly: CreateGameDtoDifficutly.Easy, 
            gameLength: CreateGameDtoGameLength.Short 
        }));
        queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
    }

    const handleJoinGame = async (_gameId: number) => {
        await GameControllerQuery.Client.joinGame(new JoinGameDto({ 
            gameId: _gameId 
        }));
        queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
    }

    if (status != "success") {
        return (
            <Center h="100vh">
                <CircularProgress isIndeterminate />
            </Center>
        );
    }

    return (
        <TyperMenuLayout 
            heading={"Game list"} 
            cancelButton={{
                buttonName: "Logout", 
                buttonAction: logout,
            }}
            acceptButton={{
                buttonName: "Create game",
                buttonAction: handleCreateGame,
            }}
        >
            <Box maxH="100%" mx="2.5%" bg="blue.200" overflowY="auto">
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
                                            <Button onClick={() => handleJoinGame}>Join</Button>
                                        </Td>
                                    </Tr>
                                )
                            })
                        }
                    </Tbody>
                </Table>
            </Box>
        </TyperMenuLayout>
    );
}
