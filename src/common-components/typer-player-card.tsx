import {
  Avatar,
  Box,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FC } from 'react';

export interface TyperPlayerCardProps {
  playerName: string;
  playerEmail: string;
  playerImg?: string;
  playerBackground?: string;
  playerElo?: number;
  playerGames?: number;
  playerRankedGames: number;
  playerCorrectWords?: number;
  playerIncorrectWords?: number;
}

export const TyperPlayerCard: FC<TyperPlayerCardProps> = (props) => {
  return (
    <Box boxShadow={'lg'} rounded={'md'} overflow={'hidden'} w="100%" h="100%">
      <Image
        maxH={'120px'}
        w={'full'}
        src={
          props.playerBackground ? props.playerBackground 
            : "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
        }
        objectFit={'cover'}
      />

      <Flex justify={'center'} mt={-12}>
        <Avatar
          size={'xl'}
          src={props.playerImg}
          css={{ border: '2px solid white' }}
        />
      </Flex>

      <Box p={6}>
        <Stack spacing={0} align={'center'} mb={5}>
          <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
            {props.playerName}
          </Heading>
          <Text color={'gray.500'}>{props.playerEmail}</Text>
          <Text color={'gray.500'}>Elo: {props.playerElo}</Text>
          <Text color={'gray.500'}>Games played: {props.playerGames}</Text>
          {props.playerRankedGames > 0 ? (
            <Text color={'gray.500'}>
              Ranked Games played: {props.playerRankedGames}
            </Text>
          ) : null}
          {props.playerCorrectWords ?? (
            <Text color={'gray.500'}>
              Correct words: {props.playerCorrectWords}
            </Text>
          )}
          {props.playerIncorrectWords ?? (
            <Text color={'gray.500'}>
              Incorrect words: {props.playerIncorrectWords}
            </Text>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
