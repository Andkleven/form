import React from "react";
import { useSpring, animated } from "react-spring";

export default ({ ...props }) => {
  const defaultStyle = {
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 13
  };

  const spring = useSpring({
    to: async next => {
      while (true) {
        await next({
          paddingTop: 1.5,
          paddingBottom: 1.5,
          paddingLeft: 6,
          paddingRight: 6,
          fontSize: 15
        });
        await next(defaultStyle);
      }
    },
    from: defaultStyle,
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
        // style={spring}
        style={defaultStyle}
        className="bg-info text-white rounded border shadow-sm"
      >
        <b>{props.children}</b>
      </animated.div>
    </div>
  );
};
