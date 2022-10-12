import { Center, Text } from "@chakra-ui/react";
import { columnStyles, transitionStyles } from "./typer-config";
import { useTransitionControl } from "./typer-state";

export interface TypeWordProps {
    key: React.Key;
    currentWord: string;
    column: number;
    duration: number;
};

export const TyperWord: React.FC<TypeWordProps> = ({key, currentWord, column, duration}) => {
    const [state, enter, exit] = useTransitionControl(duration);

    const style = {
        transition: "top " + duration + "ms linear",
        ...transitionStyles[state as keyof typeof transitionStyles] ?? {},
        ...columnStyles[column as keyof typeof columnStyles] ?? {},
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
            <Text fontSize="22px">{currentWord}</Text>
        </Center>
    );
}
