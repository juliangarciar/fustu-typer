import { COLUMN, MODE } from "./typer-config";

export interface Word {
    text: string;
    difficulty: string;
    column: string;
}

export const getWords = (): Array<Word> => {
    const loadedWords: Array<string> = [
        "air",
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
        "chair",
        "office",
        "software",
        "static",
        "controller",
    ];

    const generateWord = (currentWord: string): Word => {
        let difficulty = MODE.HARD;
        if (currentWord.length < 6) {
            difficulty = MODE.EASY;
        }

        if (currentWord.length < 8) {
            difficulty = MODE.MEDIUM;
        }

        let column = COLUMN.MID;
        let probability = Math.random();
        if (probability <= 0.33) {
            column = COLUMN.LEFT;
        }

        if (probability >= 0.63) {
            column = COLUMN.RIGHT;
        }

        return {
            text: currentWord, 
            difficulty: difficulty, 
            column: column,
        };
    }

    const generatedWords: Array<Word> = new Array<Word>();
    loadedWords.forEach((text) => {
        generatedWords.push(generateWord(text));
    });

    return generatedWords;
}
