import { Box, Button, CircularProgress, Container, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { FC } from "react";
import { useQueryClient } from "react-query";
import { GameControllerQuery, StartGameDto, UsersControllerQuery } from "../api/axios-client";

const TyperLobby: FC = () => {
    const currentGame = GameControllerQuery.useGetCurrentGameQuery();
    const currentUser = UsersControllerQuery.useMeQuery();
    const { data: meData, refetch } = UsersControllerQuery.useMeQuery();
    const queryClient = useQueryClient();
    
    if (!currentGame.data) {
        return (
            <Container centerContent={true}>
                <CircularProgress isIndeterminate />
            </Container>
        );
    }

    return (
        <ModalContent>
            <ModalHeader>{currentGame.data.title}</ModalHeader>
            <ModalBody pb={6}>
                <Table>
                    <Tbody>
                        {
                            currentGame.data.participants.map((participant) => {
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
            </ModalBody>
            <ModalFooter>    
                {
                    currentGame.data?.lead.id === currentUser.data?.id && !currentGame.data?.hasStarted ?
                        <Button onClick={async () => {
                            await GameControllerQuery.Client.startGame(new StartGameDto({ gameId: currentGame.data?.id }));
                            queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
                        }}>Start</Button>
                        : <></>
                }
            
                <Button m={6} onClick={() => {
                    localStorage.removeItem("accessToken");
                    refetch();
                }}>Logout</Button>
            </ModalFooter>
        </ModalContent>
    );
}

export default TyperLobby;