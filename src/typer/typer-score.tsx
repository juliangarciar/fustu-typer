import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Center, Text } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';

interface TyperScoreProps {
  correctWords: number;
  incorrectWords: number;
}

export const TyperScore: FC<TyperScoreProps> = ({
  correctWords,
  incorrectWords,
}) => {
  const [cWords, setCorrectWords] = useState(correctWords);
  const [iWords, setIncorrectWords] = useState(incorrectWords);

  useEffect(() => {
    setCorrectWords(correctWords);
    setIncorrectWords(incorrectWords);
  });

  return (
    <Center mx="auto">
      <Center
        minW="20%"
        bg="green.200"
        p={5}
        borderRadius="lg"
        shadow="md"
        mx={1}
      >
        <CheckIcon w={8} h={8} marginRight="2" color="green.600" />
        <Text fontSize="22px">{cWords}</Text>
      </Center>
      <Center
        minW="20%"
        bg="red.200"
        p={5}
        borderRadius="lg"
        shadow="md"
        mx={1}
      >
        <CloseIcon w={6} h={6} marginRight="2" color="red.600" />
        <Text fontSize="22px">{iWords}</Text>
      </Center>
    </Center>
  );
};
