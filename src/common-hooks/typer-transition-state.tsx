import { useEffect, useState } from 'react';

const AUTO_STATE = {
  ENTERING: 'ENTERING',
  ENTERED: 'ENTERED',
  EXITING: 'EXITING',
};

export const useAutoTransitionState = (
  stateDuration: number,
  initialDuration: number = 100,
) => {
  const [state, setState] = useState(AUTO_STATE.ENTERING);

  useEffect(() => {
    if (state === AUTO_STATE.ENTERING) {
      const timerId = setTimeout(() => setState(AUTO_STATE.ENTERED), initialDuration);
      return () => {
        clearTimeout(timerId);
      }
    }

    if (state === AUTO_STATE.ENTERED) {
      const timerId = setTimeout(() => setState(AUTO_STATE.EXITING), stateDuration);
      return () => {
        clearTimeout(timerId);
      }
    }
  }, [state]);

  return [state] as const;
};
