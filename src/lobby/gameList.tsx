import { Box, Button, CircularProgress, Container, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import { FC } from "react";
import { useQueryClient } from "react-query";
import { GameControllerQuery, JoinGameDto } from "../api/axios-client";


const GameList: FC = () => {

    const { data, status } = GameControllerQuery.useGetOpenGamesQuery();
    const queryClient = useQueryClient();

    if (status != "success" || !data) {
        return <Container centerContent={true}>
            <CircularProgress isIndeterminate />
        </Container>
    }

    return <Container>
        <Table>
            <Tbody>
                {data.map(d => {
                    return <Tr key={d.id}>
                        <Td>{d.title}</Td>
                        <Td>{d.lead.name}</Td>
                        <Td>{d.participants.length}/2</Td>
                        <Td><Button onClick={async () => {
                            await GameControllerQuery.Client.joinGame(new JoinGameDto({ gameId: d.id }));
                            queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
                        }}>Join</Button></Td>
                    </Tr>
                })}
            </Tbody>
        </Table>
    </Container>
}

export default GameList;