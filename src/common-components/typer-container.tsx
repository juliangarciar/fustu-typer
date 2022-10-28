import { Box } from "@chakra-ui/react";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

const TyperContainer: FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [ state, setState ] = useState<boolean>(false);

  useEffect(() => {
    setState(true);

    return () => {
      setState(false)
    };
    
  }, []);

  return (
    <CSSTransition nodeRef={ref} in={state} timeout={1000} classNames="game-menu" unmountOnExit>
      <Box className="game-menu" w="40%" h="80%" m="auto" minW="600px" minH="600px" bg="white" borderRadius="2xl" shadow="xl" ref={ref}>
        {children}
      </Box>
    </CSSTransition>
  );
}

export default TyperContainer;