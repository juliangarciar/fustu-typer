import { Box, CircularProgress, Input, VStack } from '@chakra-ui/react';
import { FC, RefObject, useEffect, useRef, useState } from "react";
import { useQueryClient } from 'react-query';
import { io } from "socket.io-client";
import ActiveGameDataDto from "../api/activeGameData.dto";
import { GameControllerQuery, SubmitWordDto } from '../api/axios-client';
import TyperScore from './typer-score';
import TyperWord from "./typerword";


const Typer: FC<{gameState: string, gameId: string}> = ({gameState, gameId}) => {
    const inputEl: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    
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
            clearInterval(updateInterval);
            socket.disconnect();
        }
    }, []);

    if (!data) {
        return <CircularProgress isIndeterminate />
    }

    const currentTs = new Date().valueOf() - data.game.startedTimestamp;

    return (
        <Box width="100vw" height="100vh" bg="blue.100" display="flex">
            <VStack w="60%" h="90%" minWidth="800px" minHeight="600px" m="auto" spacing={2} overflow="hidden">
                <Box height="10%" width="100%" position="relative" >
                    <TyperScore correctWords={data.correctSubmissions} incorrectWords={data.wrongSubmissions}></TyperScore>
                </Box>
                <Box borderRadius="lg" shadow="md" width="100%" height="75%" bg="blue.300" paddingX="10px" paddingTop="10px" m={0} position="relative">
                {data.wordsToBeSubmitted.filter(
                    w => w.validFrom < currentTs && w.validUntil > currentTs
                ).map((w, idx) =>
                    <TyperWord 
                        key={w.id}
                        currentWord={w.word} 
                        column={w.column}
                        duration={w.validUntil - w.validFrom}
                    />
                )}
                </Box>
                <Box width="100%" height="10%" bg="white" borderRadius="xl" position="relative">
                <Input height="100%" 
                    type="text" 
                    placeholder="Input word..." 
                    size="lg" 
                    shadow="md" 
                    autoFocus 
                    value={currentWord} 
                    onChange={(e) => { setCurrentWord(e.target.value) }}
                    onKeyDown={async (e) => {
                        if (e.key == "Enter") {
                            const result = await GameControllerQuery.Client.submitWord(new SubmitWordDto({ gameId, word: currentWord }));
                            queryClient.invalidateQueries(GameControllerQuery.getGameStateQueryKey(gameId));
                            setCurrentWord("");
                            if (result.gameFinished) {
                                queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
                            }
                        }
                    }} 
                />
                </Box>
            </VStack>
        </Box>
    );
}

const useForceUpdate = () => {
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

export default Typer;
