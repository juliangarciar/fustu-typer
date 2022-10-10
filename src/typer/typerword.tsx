import { Center, Text, useFocusEffect } from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { columnStyles, transitionStyles } from "./typer-config";
import { useTransitionControl } from "./typer-state";

export interface TypeWordProps {
    currentWord: string;
    column: number;
    duration: number;
};

const TyperWord: FC<TypeWordProps> = (props) => {
    const [state, enter, exit] = useTransitionControl(props.duration);

    const style = {
        transition: "top " + props.duration + "ms linear",
        ...transitionStyles[state as keyof typeof transitionStyles] ?? {},
        ...columnStyles[props.column as keyof typeof columnStyles] ?? {},
    };

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
            <Text fontSize="22px">{props.currentWord}</Text>
        </Center>
    );
}

export default TyperWord;
