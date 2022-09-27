import Typer from "./fustutyper/typer";
import { MODE } from "./fustutyper/typer-config";

const Game: React.FunctionComponent<{}> = () => {
    const loadedWords: Array<string> = [
        "robot",
        "welcome",
        "untracked",
        "revolver",
        "universe",
        "televisor",
        "astronaut",
        "mountain",
        "rigoberta",
        "device",
        "underwhelming",
        "discovery",
        "ancient",
        "dessert",
        "airplane",
        "rocket",
        "tracking",
    ];

    return (
        <Typer allWords={loadedWords} mode={MODE.MEDIUM} />
    );
}

export default Game;