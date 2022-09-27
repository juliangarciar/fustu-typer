import { Center, Text } from "@chakra-ui/react";
import CSS from 'csstype';
import React from "react";
import useTransitionControl, { STATE } from "./state-machine";
import { durationStyles, durationTime, transitionStyles } from "./typer-config";

export interface TypeWordProps {
    id: string;
    currentWord: string;
    mode: string;
    onExit?: (uuid: string) => void;
    right: boolean;
};

const defaultStyle: CSS.Properties = {
    top: "1%",
    transitionTimingFunction: "linear",
    position: "absolute",
    padding: "1%",
    maxWidth: "50%",
    height: "5%",
};

const TyperWord = ({id, currentWord, mode, onExit = undefined, right=false}: TypeWordProps) => {
    const [state, enter, exit] = useTransitionControl(durationTime[mode as keyof typeof durationTime]);

    const style = {
        ...defaultStyle,
        ...durationStyles[mode as keyof typeof durationStyles] ?? {},
        ...transitionStyles[state as keyof typeof transitionStyles] ?? {},
    };

    React.useEffect(() => {
        if (state === STATE.EXITING) {
            onExit && onExit(id);
        }
    });

    if (right) {
        return (
            <Center className="typerword" bg="yellow.100" style={style} shadow="md" borderRadius="md" right="10%" p={5}>
                <Text fontSize="22px">{currentWord}</Text>
            </Center> 
        );
    } else {
        return ( 
            <Center className="typerword" bg="yellow.100" style={style} shadow="md" borderRadius="md" left="10%" p={5}>
                <Text fontSize="22px">{currentWord}</Text>
            </Center> 
        );
    }
}

export default TyperWord;
