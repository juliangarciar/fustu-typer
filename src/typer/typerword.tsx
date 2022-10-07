import { Center, Text } from "@chakra-ui/react";
import CSS from 'csstype';
import React from "react";
import useTransitionControl, { STATE } from "./typer-state";
import { columnStyles, durationStyles, durationTime, transitionStyles } from "./typer-config";

export interface TypeWordProps {
    uuid: string;
    currentWord: string;
    mode: string;
    onExit?: (uuid: string) => void;
    column: string;
};

const TyperWord = ({uuid, currentWord, mode, onExit = undefined, column}: TypeWordProps) => {
    const [state, enter, exit] = useTransitionControl(durationTime[mode as keyof typeof durationTime]);

    const style = {
        ...durationStyles[mode as keyof typeof durationStyles] ?? {},
        ...transitionStyles[state as keyof typeof transitionStyles] ?? {},
        ...columnStyles[column as keyof typeof columnStyles] ?? {},
    };

    React.useEffect(() => {
        if (state === STATE.EXITING) {
            onExit && onExit(uuid);
        }
    });

    return (
        <Center className="typerword" 
                style={style} 
                shadow="md" 
                borderRadius="md"
                top="1%"
                position="absolute"
                padding="1%"
                maxWidth="50%"
                height="5%"
                bgColor="yellow.100">
            <Text fontSize="22px">{currentWord}</Text>
        </Center> 
    );
}

export default TyperWord;
