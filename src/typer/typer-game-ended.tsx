import { Box, HStack } from "@chakra-ui/react";
import { FC, useContext } from "react";
import { GameControllerQuery } from "../api/axios-client";
import { TyperLoading } from "../common/components/typer-loading";
import { GameStateContext, GAME_STATE } from "../common/typer-gamestate-context";
import { TyperMenuLayout } from "../menu/typer-menu-layout";
import { TyperPlayerCard } from "../menu/typer-player-card";

export const TyperGameEnded: FC = () => {
  const { data: currentGame } = GameControllerQuery.useGetCurrentGameQuery();
  const { setGameState } = useContext(GameStateContext);

  const handleBackToMenu = () => {
    setGameState(GAME_STATE.GAME_MENU);
  };

  if (!currentGame) return <TyperLoading />;
  
  return (
    <TyperMenuLayout
      heading={"Results"}
      cancelButton={{
        buttonName: "Back to menu",
        buttonAction: () => handleBackToMenu(),
      }}
      acceptButton={undefined}
    >
      <HStack h="100%" mx="2.5%" spacing="5%">
        <Box>
          <TyperPlayerCard
            playerName={currentGame.winner.name}
            playerEmail={currentGame.winner.email}
            playerImg={currentGame.winner.avatar}
            playerElo={currentGame.winner.rating}
            playerGames={currentGame.winner.gamesPlayed}
            playerRankedGames={currentGame.winner.rankedGamesPlayed}
          />
        </Box>
      </HStack>
    </TyperMenuLayout>
  );
}