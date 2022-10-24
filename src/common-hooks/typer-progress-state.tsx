import { useEffect, useState } from "react";

export const useProgressState = (duration: number, steps: number) => {
  const [stepsProgressed, setSteps] = useState(0);
  const stepDuration = duration / steps;
  
  useEffect(() => {
    if (stepsProgressed < steps) {
      let timeoutId = setTimeout(() => setSteps(steps => steps + 1), stepDuration);
      return () => {
        clearTimeout(timeoutId);
      }
    }
  }, [stepsProgressed]);

  return [stepsProgressed] as const;
}
