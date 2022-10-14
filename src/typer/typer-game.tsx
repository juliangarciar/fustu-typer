import { Box, Center, CircularProgress, Input, VStack } from '@chakra-ui/react';
import { FC, useState } from "react";
import { useQueryClient } from 'react-query';
import { GameControllerQuery, SubmitWordDto } from '../api/axios-client';
import { TyperScore } from './typer-score';
import { TyperWord } from "./typer-word";

export const TyperGame: FC<{ gameId: number }> = ({ gameId }) => {
    const { data } = GameControllerQuery.useGetGameStateQuery(gameId);
    const [currentWord, setCurrentWord] = useState("");
    const queryClient = useQueryClient();
    
    const handleKeyInput = async (e: React.KeyboardEvent) => {
        if (e.key == "Enter") {
            const result = await GameControllerQuery.Client.submitWord(new SubmitWordDto({ gameId, word: currentWord }));
            queryClient.invalidateQueries(GameControllerQuery.getGameStateQueryKey(gameId));
            setCurrentWord("");
            if (result.gameFinished) {
                queryClient.invalidateQueries(GameControllerQuery.getCurrentGameQueryKey());
            }
        }
    };

    if (!data) {
        return <Center h="100vh"><CircularProgress isIndeterminate /></Center>;
    }

    const currentTs = new Date().valueOf() - data.game.startedTimestamp;

    return (
        <Box width="100vw" height="100vh" bg="blue.100" display="flex">
            <VStack w="60%" h="90%" minWidth="800px" minHeight="600px" m="auto" spacing={2} overflowY="hidden">
                <Box height="10%" width="100%" position="relative" >
                    <TyperScore correctWords={data.correctSubmissions} incorrectWords={data.wrongSubmissions}></TyperScore>
                </Box>
                <Box borderRadius="lg" shadow="md" width="100%" height="75%" bg="blue.300" paddingX="10px" paddingTop="10px" m={0} position="relative">
                    {
                        data.wordsToBeSubmitted.filter(
                            w => w.validFrom < currentTs && w.validUntil > currentTs
                        ).map((w, idx) =>
                            <TyperWord 
                                key={w.id}
                                currentWord={w.word} 
                                column={w.column}
                                duration={w.validUntil - w.validFrom}
                            />
                        )
                    }
                </Box>
                <Box width="100%" height="10%" bg="white" borderRadius="xl" position="relative">
                <Input height="100%" 
                    type="text" 
                    placeholder="Input word..." 
                    size="lg" 
                    shadow="md" 
                    autoFocus 
                    value={currentWord} 
                    onChange={(e: React.FormEvent<HTMLInputElement>) => { setCurrentWord(e.currentTarget.value)}}
                    onKeyDown={(e: React.KeyboardEvent) => { handleKeyInput(e) }} 
                />
                </Box>
            </VStack>
        </Box>
    );
}
