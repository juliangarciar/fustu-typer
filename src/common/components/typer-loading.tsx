import { Center, CircularProgress } from "@chakra-ui/react";
import { FC } from "react";

export const TyperLoading: FC = () => {
  return (
    <Center h="100vh">
      <CircularProgress isIndeterminate />
    </Center>
  );
}