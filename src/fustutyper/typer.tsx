import { Box, Input, VStack } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from "react";
import { FRECUENCY } from './typer-config';
import TyperScore from './typer-score';
import { Word } from './typer-service';
import TyperWord, { TypeWordProps } from "./typerword";

interface TyperProps {
    words: Array<Word>;
    endGame: () => void;
    gameState: boolean;
};

const generateUUID = (index: number) => {
    return "word_" + new Date().getTime() + "_" + index;
};

const Typer = ({words, endGame, gameState}: TyperProps) => {
    const inputEl: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
    const [currentWords, setCurrentWords] = React.useState<Array<TypeWordProps>>([]);
    const copyWords: Array<TypeWordProps> = words.map<TypeWordProps>((word, index) => ({
        uuid: generateUUID(index), 
        currentWord: word.text, 
        mode: word.difficulty,
        column: word.column,
    }));
    const [failedWords, setFailedWords] = React.useState(0);
    const [correctWords, setCorrectWords] = React.useState(0);
    let currentIndex: number = 0;
    let [gameEnded, setGameEnded] = React.useState(false);

    useEffect(() => {
        if (gameState) {
            gameEnded = false;
            setFailedWords(0);
            setCorrectWords(0);
            update();
        }
    }, [gameState]);

    const update = () => {
        if (gameState) {
            let timerId = setInterval(() => {
                if (currentIndex < copyWords.length) {
                    setCurrentWords(existingWords => {
                        return [copyWords.at(currentIndex) as TypeWordProps, ...existingWords];
                    });
                } else {
                    setGameEnded((gameEnded) => gameEnded = true);
                    clearInterval(timerId);
                }
                currentIndex++;
            }, FRECUENCY[copyWords.at(currentIndex)?.mode as keyof typeof FRECUENCY]);
        }
    };

    const deleteWord = (index: number) => {
        if (index > -1) {
            let copyWords = currentWords.slice();
            copyWords.splice(index, 1);
            setCurrentWords((currentWords) => currentWords = copyWords);

            if (gameEnded && copyWords.length === 0) {
                endGame();
            }
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === 'Space') {
            if (inputEl && inputEl.current && inputEl.current.value) {
                let index = currentWords.findIndex(word => word.currentWord === inputEl.current?.value);
                if (index > -1) {
                    deleteWord(index);
                    setCorrectWords(currentCorrectWords => currentCorrectWords + 1);
                }
                
                inputEl.current.value = '';
            }
        }
    };
    
    const handleExitWord = (uuid: string) => {
        let index = currentWords.findIndex(word => word.uuid === uuid);
        deleteWord(index);
        setFailedWords(currentFailedWords => currentFailedWords + 1);
    };

    return (
        <Box width="100vw" height="100vh" bg="blue.100" display="flex">
            <VStack w="60%" h="90%" minWidth="800px" minHeight="600px" m="auto" spacing={2} overflow="hidden">
                <Box height="10%" width="100%" position="relative" >
                    <TyperScore correctWords={correctWords} incorrectWords={failedWords}></TyperScore>
                </Box>
                <Box borderRadius="lg" shadow="md" width="100%" height="80%" bg="blue.300" paddingX="10px" paddingTop="10px" m={0} position="relative">
                    {currentWords.map(word => 
                        <TyperWord 
                            key={word.uuid}
                            uuid={word.uuid} 
                            currentWord={word.currentWord} 
                            mode={word.mode}
                            column={word.column}
                            onExit={(id: string) => handleExitWord(id)}
                        />
                    )}
                </Box>
                <Box width="100%" height="10%" bg="white" borderRadius="xl" position="relative">
                    <Input height="100%" ref={inputEl} type="text" placeholder="Input word..." size="lg" onKeyPress={handleKeyPress} shadow="md" autoFocus />
                </Box>
            </VStack>
        </Box>
    );
}

export default Typer;
