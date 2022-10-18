import { Box, Button, Center, Heading, VStack } from "@chakra-ui/react";
import { FC } from "react";

export interface TyperMenuLayoutProps {
    heading: string;
    children: React.ReactNode;
    cancelButton?: {
        buttonName: string;
        buttonAction: any;
    };
    acceptButton?: {
        buttonName: string;
        buttonAction: any;
    };
};

export const TyperMenuLayout: FC<TyperMenuLayoutProps> = (props) => {
    return (
        <VStack w="100%" h="100%" spacing="0">
            <Center h="10%">
                <Heading>{props.heading}</Heading>
            </Center>
            <Box w="100%" h="80%">
                {props.children}
            </Box>
            <Center h="10%" w="100%">
                {props.cancelButton ?  
                    <Button w="45%" mx="2.5%" onClick={props.cancelButton?.buttonAction}>
                        {props.cancelButton.buttonName}
                    </Button> : <></>
                }
                {props.acceptButton ?
                    <Button w="45%" mx="2.5%" onClick={props.acceptButton?.buttonAction}>
                        {props.acceptButton.buttonName}
                    </Button> : <></>
                }
            </Center>
        </VStack>
    );
}
