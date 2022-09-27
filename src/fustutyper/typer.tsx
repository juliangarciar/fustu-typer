import { Box, Input, VStack } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from "react";
import { FRECUENCY } from './typer-config';
import TyperScore from './typer-score';
import TyperWord, { TypeWordProps } from "./typerword";

interface TyperProps {
    allWords: Array<string>;
    mode: string;
};

const generateUUID = (index: number) => {
    return "word_" + new Date().getTime() + "_" + index;
};

const Typer = ({allWords, mode}: TyperProps) => {
    const inputEl: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
    const [currentWords, setCurrentWords] = React.useState<Array<TypeWordProps>>([]);
    const copyWords: Array<TypeWordProps> = allWords.map<TypeWordProps>((wordString, index) => ({
        id: generateUUID(index), 
        currentWord: wordString, 
        mode: mode,
        right: Math.random() < 0.5,
    }));
    const [failedWords, setFailedWords] = React.useState(0);
    const [correctWords, setCorrectWords] = React.useState(0);
    let currentIndex: number = -1;

    useEffect(() => {
        let timerId = setInterval(() => {
            currentIndex++;
            if (currentIndex < copyWords.length) {
                setCurrentWords(existingWords => {
                    return [copyWords.at(currentIndex) as TypeWordProps, ...existingWords];
                });
            } else {
                clearInterval(timerId);
            }
        }, FRECUENCY[mode as keyof typeof FRECUENCY]);
    }, []);

    const deleteWord = (index: number) => {
        if (index > -1) {
            let copyWords = currentWords.slice();
            copyWords.splice(index, 1);
            setCurrentWords(copyWords);
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
    
    const handleExitWord = (id: string) => {
        let index = currentWords.findIndex(word => word.id === id);
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
                            key={word.id}
                            id={word.id} 
                            currentWord={word.currentWord} 
                            mode={word.mode}
                            right={word.right}
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
