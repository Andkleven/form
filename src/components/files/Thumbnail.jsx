import React from "react";
import { useSpring, animated } from "react-spring";

// Docs: https://www.react-spring.io/docs/hooks/basics
export default ({ src, filename, description }) => {
  const extension = filename.substr(filename.lastIndexOf(".") + 1);

  const spring = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    config: {}
  });

  return (
    <>
      <animated.div style={spring}></animated.div>
    </>
  );
};
