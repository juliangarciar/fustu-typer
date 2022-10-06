import { Box, CircularProgress, Container, Input, useQuery } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { GameControllerQuery, SubmitWordDto } from "../api/axios-client";
import { io } from "socket.io-client";


const MockGame: FC<{ gameId: string }> = ({ gameId }) => {

    const { data } = GameControllerQuery.useGetGameStateQuery(gameId);
    const [currentWord, setCurrentWord] = useState("");
    const queryClient = useQueryClient();

    useEffect(() => {

        const socket = io('http://localhost:3333/', {
            auth: {
                token: localStorage.getItem("accessToken")
            },
            query: {
                "gameId": gameId
            }
        });

        socket.on("message", (d) => {
            console.log(d);
        });

        return () => {
            socket.disconnect();
        }
    }, [])

    if (!data) {
        return <CircularProgress isIndeterminate />
    }

    return <Container>
        <Box>
            {data.wordsToBeSubmitted.map((w, idx) =>
                <p key={idx}>{JSON.stringify(w)}</p>
            )}
        </Box>
        <Input value={currentWord} onChange={(e) => { setCurrentWord(e.target.value) }}
            onKeyDown={async (e) => {
                if (e.key == "Enter") {
                    const result = await GameControllerQuery.Client.submitWord(new SubmitWordDto({ gameId, word: currentWord }));
                    queryClient.invalidateQueries(GameControllerQuery.getGameStateQueryKey(gameId));
                    setCurrentWord("");
                    if (result.gameFinished) {
                        queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
                    }
                }
            }} />
    </Container>
}

export default MockGame;