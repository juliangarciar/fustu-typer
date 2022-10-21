import { Center, CircularProgress } from "@chakra-ui/react";
import { FC, useContext, useEffect } from "react";
import { GameStateContext, GAME_STATE } from "../common-hooks/typer-gamestate-context";
import { useProgressState } from "../common-hooks/typer-progress-state";

const STEPS = 27;
const STEP_VALUE = 4;

export const TyperGameLoading: FC<{ duration: number }> = ({duration}) => {
  const [stepsProgressed] = useProgressState(duration, STEPS);
  const { setGameState } = useContext(GameStateContext);
  
  useEffect(() => {
    if (duration <= 0) {
      setGameState(GAME_STATE.GAME_STARTED);
    }
  }, []);

  useEffect(() => {
    if (stepsProgressed === STEPS) {
      setGameState(GAME_STATE.GAME_STARTED);
    }
  }, [stepsProgressed]);

  return (
    <Center h="100%">
      <CircularProgress size="sm" thickness="2px" value={stepsProgressed * STEP_VALUE} />
    </Center>
  );
};

export type LoadedCallback = () => void;