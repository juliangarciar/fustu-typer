import { Center, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useAutoTransitionState } from '../common-hooks/typer-transition-state';

interface TypeWordProps {
  key: React.Key;
  currentWord: string;
  column: number;
  validUntil: number;
  validFrom: number;
  currentTs: number;
}

const COLUMN_STYLES = {
  0: { left: '5%' },
  1: { left: '50%', transform: 'translateX(-50%)' },
  2: { right: '5%' },
};

const MAX_TOP = 95;

export const TyperWord: FC<TypeWordProps> = ({
  currentWord,
  column,
  validUntil,
  validFrom,
  currentTs,
}) => {
  const waitingTime = validFrom - currentTs;
  const originalDuration = validUntil - validFrom;
  const currentDuration = currentTs > validFrom ? validUntil - currentTs : originalDuration;
  const initialTop = waitingTime < 0 ? (-waitingTime * MAX_TOP / originalDuration) : 0;
  
  const [transitionState] = useAutoTransitionState(currentDuration, waitingTime > 0 ? waitingTime : 0);
  
  const transitionAnimation = 'top ' + currentDuration + 'ms linear, opacity 100ms';
  const STATE_STYLES = {
    ENTERING: { top: initialTop + '%', opacity: 0 },
    ENTERED: { top: MAX_TOP + '%', opacity: 1 },
    EXITING: { top: MAX_TOP + '%', opacity: 0 },
  };
  const style = {
    ...(STATE_STYLES[transitionState as keyof typeof STATE_STYLES] ?? {}),
    ...(COLUMN_STYLES[column as keyof typeof COLUMN_STYLES] ?? {}),
  };

  return (
    <Center
      className="typerword"
      style={style}
      shadow="md"
      borderRadius="md"
      position="absolute"
      maxW="50%"
      h="5%"
      transition={transitionAnimation}
      bgColor="yellow.100"
    >
      <Text fontSize="1.5em">{currentWord}</Text>
    </Center>
  );
};
