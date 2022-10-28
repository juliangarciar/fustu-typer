import { Box, Input, VStack } from '@chakra-ui/react';
import { FC, useContext, useEffect, useState } from 'react';
import { GameControllerQuery, SubmitWordDto } from '../api/axios-client';
import TyperContainer from '../common-components/typer-container';
import { TyperLoading } from '../common-components/typer-loading';
import { GameStateContext, GAME_STATE } from '../common-hooks/typer-gamestate-context';
import { TyperScore } from './typer-score';
import { TyperWord } from './typer-word';

const EXTRA_FINISH_TIME = 1000;
const DEFAULT_GAME_DURATION = 20000;

export const TyperGame: FC<{ gameId: number }> = ({ gameId }) => {
  const { data: currentGame, refetch } = GameControllerQuery.useGetGameStateQuery(gameId);
  const { setGameState } = useContext(GameStateContext);
  const [ currentWord, setCurrentWord ] = useState('');

  useEffect(() => {
    const gameLength = getGameLength();
    const timeoutId = setTimeout(() => {
      setGameState(GAME_STATE.GAME_FINISHED);
    }, gameLength);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentGame]);

  const getGameLength = () => {
    if (currentGame) {
      const length = currentGame.wordsToBeSubmitted.length - 1;
      const duration = currentGame.wordsToBeSubmitted.at(length)?.validUntil;
      if (duration) {
        return duration - getCurrentTs() + EXTRA_FINISH_TIME;
      }
    }
    
    return DEFAULT_GAME_DURATION;
  };

  const handleKeyInput = async (e: React.KeyboardEvent) => {
    if (e.key == 'Enter') {
      const result = await GameControllerQuery.Client.submitWord(
        new SubmitWordDto({ 
          gameId, 
          word: currentWord 
        })
      );
      refetch();
      setCurrentWord('');
    }
  };

  const getCurrentTs = () => {
    if (currentGame) {
      return new Date().valueOf() - currentGame.game.startedTimestamp;
    }
    return 0;
  };

  if (!currentGame) return <TyperLoading />;

  return (
    <TyperContainer>
      <VStack h="100%" w="100%" spacing={2} overflowY="hidden" bg="blue.100">
        <Box h="10%" position="relative" >
          <TyperScore
            correctWords={currentGame.correctSubmissions}
            incorrectWords={currentGame.wrongSubmissions}
          ></TyperScore>
        </Box>
        <Box w="100%" h="80%" borderRadius="lg" shadow="md" bg="blue.300" m={0} position="relative">
          {
            currentGame.wordsToBeSubmitted
              .filter((w) => w.validUntil > (getCurrentTs() + 200))
              .map((w) => (
                <TyperWord
                  key={w.id}
                  currentWord={w.word}
                  column={w.column}
                  validUntil={w.validUntil}
                  validFrom={w.validFrom}
                  currentTs={getCurrentTs()}
                />
              ))
          }
        </Box>
        <Box w="100%" h="10%" bg="white" borderRadius="xl" position="relative">
          <Input h="100%" type="text" placeholder="Input word..." size="lg" shadow="md" autoFocus 
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
    </TyperContainer>
  );
};
