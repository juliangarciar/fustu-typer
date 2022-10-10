import { Box, CircularProgress, Container, Input, useQuery } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { GameControllerQuery, SubmitWordDto } from "../api/axios-client";
import { io } from "socket.io-client";
import ActiveGameDataDto from "../api/activeGameData.dto";


const MockGame: FC<{ gameId: string }> = ({ gameId }) => {

    const { data } = GameControllerQuery.useGetGameStateQuery(gameId);
    const [currentWord, setCurrentWord] = useState("");
    const queryClient = useQueryClient();
    const forceUpdate = useForceUpdate();

    useEffect(() => {
        
        const socket = io('http://localhost:3333/', {
            auth: {
                token: localStorage.getItem("accessToken")
            },
            query: {
                "gameId": gameId
            }
        });

        socket.on("message", (d: ActiveGameDataDto) => {
            if (d.status.gameStarted) {
                queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
                queryClient.invalidateQueries(GameControllerQuery.getGameStateQueryKey(gameId));
            }
        });

        const updateInterval = setInterval(forceUpdate, 100);
        return () => {
            clearInterval(updateInterval)
            socket.disconnect();
        }
    }, []);

    if (!data) {
        return <CircularProgress isIndeterminate />
    }


    const currentTs = new Date().valueOf() - data.game.startedTimestamp;

    return <Container>
        <Box>
            {data.wordsToBeSubmitted.filter(
                w => w.validFrom < currentTs &&
                    w.validUntil > currentTs
            ).map((w, idx) =>
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

const useForceUpdate = () => {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default MockGame;