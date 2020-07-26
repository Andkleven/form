import React from "react";
import { useSpring, animated } from "react-spring";

export default ({ ...props }) => {
  const spring = useSpring({
    to: async (next, cancel) => {
      while (true) {
        await next({
          paddingTop: 2,
          paddingBottom: 2,
          paddingLeft: 6,
          paddingRight: 6,
          fontSize: 15
        });
        await next({
          paddingTop: 0.5,
          paddingBottom: 0.5,
          paddingLeft: 4,
          paddingRight: 4,
          fontSize: 14
        });
      }
    },
    from: {
      paddingTop: 1,
      paddingBottom: 1,
      paddingLeft: 4,
      paddingRight: 4,
      fontSize: 14
    },
    config: {
      tension: 175,
      friction: 50,
      clamp: true,
      mass: 10
    }
  });

  return (
    <div
      style={{
        height: 0,
        width: 0
      }}
      className="d-flex justify-content-center align-items-center"
    >
      <animated.div
        style={spring}
        className="bg-info text-white rounded border shadow-sm"
      >
        <b>{props.children}</b>
      </animated.div>
    </div>
  );
};
