
export const MODE = {
    EASY:   "easy",
    MEDIUM: "medium",
    HARD:   "hard",
};

export const COLUMN = {
    LEFT:   "left",
    MID:    "mid",
    RIGHT:  "right",
};

export const durationStyles = {
    hard:   { transition: "top 3000ms linear" },
    medium: { transition: "top 2500ms linear" },
    easy:   { transition: "top 2000ms linear" },
};

export const columnStyles = {
    0:   { left: "5%" },
    1:    { left: "50%", transform: "translateX(-50%)" },
    2:  { right: "5%"},
};

export const durationTime = {
    hard:   3000,
    medium: 2500,
    easy:   2000,
};

export const FRECUENCY = {
    hard:   2000,
    medium: 1500,
    easy:   1000,
};

export const transitionStyles = {
    entered: { top: "94%" },
    exiting: { opacity: 1 },
};
