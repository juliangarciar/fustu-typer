export default interface ActiveGameDataDto {
  status: {
    gameStarted: boolean;
    gameFinished: boolean;
    countDown: number;
    countDownStarted: boolean;
  };
  [userId: string]: any;
}
