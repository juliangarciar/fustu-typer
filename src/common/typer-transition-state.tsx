import { useEffect, useState } from "react";

const AUTO_STATE = {
    ENTERING: "ENTERING",
    ENTERED: "ENTERED",
    EXITING: "EXITING",
};

export const useAutoTransitionState = (stateDuration: number, initialDuration: number = 100) => {
    const [state, setState] = useState(AUTO_STATE.ENTERING);

    useEffect(() => {
        let timerId: any;
        if (state === AUTO_STATE.ENTERING) {
            timerId = setTimeout(() => setState(AUTO_STATE.ENTERED), initialDuration);
        }

        if (state === AUTO_STATE.ENTERED) {
            timerId = setTimeout(() => setState(AUTO_STATE.EXITING), stateDuration);
        }
    });

    return [state] as const;
}
