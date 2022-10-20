import { useEffect, useState } from "react";

export const useProgressState = (duration: number, steps: number) => {
  const [stepsProgressed, setSteps] = useState(0);
  const stepDuration = duration / steps;
  
  useEffect(() => {
    if (stepsProgressed < steps) {
      setTimeout(() => setSteps(steps => steps + 1), stepDuration);
    }
  }, [stepsProgressed]);

  return [stepsProgressed] as const;
}
