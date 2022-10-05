import { Box, CircularProgress, Container, Input, useQuery } from "@chakra-ui/react";
import { FC, useState } from "react";
import { useQueryClient } from "react-query";
import { GameControllerQuery, SubmitWordDto } from "../api/axios-client";


const MockGame: FC<{ gameId: string }> = ({ gameId }) => {

    const { data } = GameControllerQuery.useGetGameStateQuery(gameId);
    const [currentWord, setCurrentWord] = useState("");
    const queryClient = useQueryClient();

    if (!data) {
        return <CircularProgress isIndeterminate />
    }

    return <Container>
        <Box>
            {data.wordsToBeSubmitted.map((w, idx) =>
                <p key={idx}>{w}</p>
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