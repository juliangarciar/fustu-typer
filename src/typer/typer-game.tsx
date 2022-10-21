import { Box, Input, VStack } from '@chakra-ui/react';
import { FC, useContext, useEffect, useState } from 'react';
import { GameControllerQuery, SubmitWordDto } from '../api/axios-client';
import { TyperLoading } from '../common-components/typer-loading';
import { GameStateContext, GAME_STATE } from '../common-hooks/typer-gamestate-context';
import { TyperScore } from './typer-score';
import { TyperWord } from './typer-word';

export const TyperGame: FC<{ gameId: number }> = ({ gameId }) => {
  const { data: currentGame, refetch } = GameControllerQuery.useGetGameStateQuery(gameId);
  const { setGameState } = useContext(GameStateContext);
  const [ currentWord, setCurrentWord ] = useState('');

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      refetch();
    }, 500);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (currentGame && currentGame.game.hasFinished === true) {
      setGameState(GAME_STATE.GAME_FINISHED);
    }
  }, [currentGame]);

  const handleKeyInput = async (e: React.KeyboardEvent) => {
    if (e.key == 'Enter') {
      const result = await GameControllerQuery.Client.submitWord(
        new SubmitWordDto({ 
          gameId, 
          word: currentWord 
        })
      );
      setCurrentWord('');
    }
  };

  if (!currentGame) return <TyperLoading />;
  
  const currentTs = new Date().valueOf() - currentGame.game.startedTimestamp;

  return (
    <VStack
      height="100%"
      width="100%"
      spacing={2}
      overflowY="hidden"
      bg="blue.100"
    >
      <Box position="relative" height="10%">
        <TyperScore
          correctWords={currentGame.correctSubmissions}
          incorrectWords={currentGame.wrongSubmissions}
        ></TyperScore>
      </Box>
      <Box
        borderRadius="lg"
        shadow="md"
        width="100%"
        height="80%"
        bg="blue.300"
        m={0}
        position="relative"
      >
        {currentGame.wordsToBeSubmitted
          .filter((w) => w.validFrom < currentTs && w.validUntil > currentTs)
          .map((w, idx) => (
            <TyperWord
              key={w.id}
              currentWord={w.word}
              column={w.column}
              duration={w.validUntil - w.validFrom}
            />
          ))}
      </Box>
      <Box
        width="100%"
        height="10%"
        bg="white"
        borderRadius="xl"
        position="relative"
      >
        <Input
          height="100%"
          type="text"
          placeholder="Input word..."
          size="lg"
          shadow="md"
          autoFocus
          value={currentWord}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setCurrentWord(e.currentTarget.value);
          }}
          onKeyDown={(e: React.KeyboardEvent) => {
            handleKeyInput(e);
          }}
        />
      </Box>
    </VStack>
  );
};
