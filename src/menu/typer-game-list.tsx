import { Button, CircularProgress, Container, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { FC } from "react";
import { useQueryClient } from "react-query";
import { CreateGameDto, GameControllerQuery, JoinGameDto, UsersControllerQuery } from "../api/axios-client";

export const TyperGameList: FC = () => {
    const { data: openGamesData, status } = GameControllerQuery.useGetOpenGamesQuery();
    const { data: meData, refetch } = UsersControllerQuery.useMeQuery();
    const queryClient = useQueryClient();

    if (status != "success" || !openGamesData) {
        return (
            <Container centerContent={true}>
                <CircularProgress isIndeterminate />
            </Container>
        );
    }

    return (
        <ModalContent>
            <ModalHeader>Game list</ModalHeader>
            <ModalBody pb={6}>
                <Table>
                    <Tbody>
                        {openGamesData.map(openGame => {
                            return <Tr key={openGame.id}>
                                <Td>{openGame.title}</Td>
                                <Td>{openGame.lead.name}</Td>
                                <Td>{openGame.participants.length}/2</Td>
                                <Td><Button onClick={async () => {
                                    await GameControllerQuery.Client.joinGame(new JoinGameDto({ gameId: openGame.id }));
                                    queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
                                }}>Join</Button></Td>
                            </Tr>
                        })}
                    </Tbody>
                </Table>
            </ModalBody>
            <ModalFooter>
                <Button m={6} onClick={async () => {
                    await GameControllerQuery.Client.createGame(new CreateGameDto({ title: "New Game" })).then(() => console.log("yay"));
                    queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
                }}>Create Game</Button>

                <Button m={6} onClick={() => {
                    localStorage.removeItem("accessToken");
                    refetch();
                }}>Logout</Button>
            </ModalFooter>
        </ModalContent>
    );
}