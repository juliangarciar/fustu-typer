import { useEffect, useState } from "react";

export const STATE = {
    ENTERING: "entering",
    ENTERED: "entered",
    EXITING: "exiting",
};

const useTransitionState = (duration: number) => {
    const [state, setState] = useState(STATE.ENTERING);

    useEffect(() => {
        let timerId: number;
        if (state === STATE.ENTERING) {
            timerId = setTimeout(() => setState(STATE.ENTERED), 100);
        }

        if (state === STATE.ENTERED) {
            timerId = setTimeout(() => setState(STATE.EXITING), duration);
        }
    });

    return [state, setState] as const;
}

export const useTransitionControl = (duration: number) => {
    const [state, setState] = useTransitionState(duration);

    const enter = () => {
        if (state !== STATE.EXITING) {
            setState(STATE.ENTERING);
        }
    };

    const exit = () => {
        if (state !== STATE.ENTERING) {
            setState(STATE.EXITING);
        }
    };

    return [state, enter, exit] as const;
}
