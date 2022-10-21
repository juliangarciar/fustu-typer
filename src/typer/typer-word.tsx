import { Center, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useAutoTransitionState } from '../common-hooks/typer-transition-state';

const COLUMN_STYLES = {
  0: { left: '5%' },
  1: { left: '50%', transform: 'translateX(-50%)' },
  2: { right: '5%' },
};

const STATE_STYLES = {
  ENTERING: { top: '0%', opacity: 0 },
  ENTERED: { top: '95%', opacity: 1 },
  EXITING: { top: '95%', opacity: 0 },
};

interface TypeWordProps {
  key: React.Key;
  currentWord: string;
  column: number;
  duration: number;
}

export const TyperWord: FC<TypeWordProps> = ({
  currentWord,
  column,
  duration,
}) => {
  const [transitionState] = useAutoTransitionState(duration);
  const transitionAnimation = 'top ' + duration + 'ms linear, opacity 400ms';
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
      maxWidth="50%"
      height="5%"
      transition={transitionAnimation}
      bgColor="yellow.100"
    >
      <Text fontSize="1.5em">{currentWord}</Text>
    </Center>
  );
};
