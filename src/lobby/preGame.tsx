import { Box, Button, Container, Heading } from "@chakra-ui/react";
import { FC } from "react";
import { useQueryClient } from "react-query";
import { GameControllerQuery, StartGameDto, UsersControllerQuery } from "../api/axios-client";
import GameList from "./gameList";
import MockGame from "./mockGame";


const PreGame: FC = () => {

    const currentGame = GameControllerQuery.useGetCurrentGameQuery();
    const currentUser = UsersControllerQuery.useMeQuery();
    const queryClient = useQueryClient();

    if (!currentGame.data?.id) {
        return <GameList />
    }

    return <Container>
        <Box>
            {currentGame.data.title}
        </Box>
        {currentGame.data.lead.id === currentUser.data?.id && !currentGame.data.hasStarted ? <Box>
            <Button onClick={async () => {
                await GameControllerQuery.Client.startGame(new StartGameDto({ gameId: currentGame.data.id }));
                queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
            }}>Start</Button>
        </Box> : null}
        <Box>
            {currentGame.data.hasStarted ? <MockGame gameId={currentGame.data.id} /> : "Waiting..."}
        </Box>
    </Container>
}

export default PreGame;