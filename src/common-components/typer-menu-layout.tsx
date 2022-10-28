import { Box, Button, Center, Heading, VStack } from '@chakra-ui/react';
import { FC } from 'react';

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
}

export const TyperMenuLayout: FC<TyperMenuLayoutProps> = (props) => {
  return (
    <VStack w="100%" h="100%" spacing="0">
      <Center h="10%">
        <Heading fontWeight="semibold">{props.heading}</Heading>
      </Center>
      <Box w="100%" h="77%">
        {props.children}
      </Box>
      <Box h="13%" w="100%">
        {props.cancelButton ? (
          <Button bg="cyan.500" _hover={{ bg: "cyan.600" }} color="white" w="40%" mx="5%" my="4%" onClick={props.cancelButton?.buttonAction}>
            {props.cancelButton.buttonName}
          </Button>
        ) : (
          <></>
        )}
        {props.acceptButton ? (
          <Button bg="blue.400" _hover={{ bg: "blue.500" }} color="white" w="40%" mx="5%" my="4%" onClick={props.acceptButton?.buttonAction}>
            {props.acceptButton.buttonName}
          </Button>
        ) : (   
          <></>
        )}
      </Box>
    </VStack>
  );
};
