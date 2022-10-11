import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, BoxProps, Center, ChakraComponent, HStack, Stack, Text } from "@chakra-ui/react";
import React from "react";

interface TyperScoreProps {
    correctWords: number;
    incorrectWords: number;
    props?: BoxProps;
};

const TyperScore = ({correctWords, incorrectWords}: TyperScoreProps, ) => {
    const [cWords, setCorrectWords] = React.useState(correctWords);
    const [iWords, setIncorrectWords] = React.useState(incorrectWords);

    React.useEffect(() => {
        setCorrectWords(correctWords);
        setIncorrectWords(incorrectWords);
    });

    return (
        <Center mx="auto">
            <Center minW="20%" bg="green.200" p={5} borderRadius="lg" shadow="md" mx={1}>
                <CheckIcon w={8} h={8} marginRight="2" color="green.600" />
                <Text fontSize="22px">{cWords}</Text>
            </Center>
            <Center minW="20%" bg="red.200" p={5} borderRadius="lg" shadow="md" mx={1}>
                <CloseIcon w={6} h={6} marginRight="2" color="red.600" />
                <Text fontSize="22px">{iWords}</Text>
            </Center>
        </Center>
    );
};

export default TyperScore;
