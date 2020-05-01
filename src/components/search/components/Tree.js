import React, { memo, useState } from "react";
import { useSpring, a } from "react-spring";
import { useMeasure, usePrevious } from "../styles/helpers";
import { Frame, Title, Content } from "../styles/styles";
import * as Icons from "../styles/icons";

export default memo(({ children, name, defaultOpen = false }) => {
  const [isOpen, setOpen] = useState(defaultOpen);
  const previous = usePrevious(isOpen);
  const [bind, { height: viewHeight }] = useMeasure();
  const { height, opacity, transform } = useSpring({
    from: {
      height: 0,
      opacity: 0,
      transform: "translate3d(0,-3px,0)"
    },
    to: {
      height: isOpen ? viewHeight * 1 : 0,
      opacity: isOpen ? 1 : 0,
      transform: `translate3d(0px,${isOpen ? 0 : -3}px,0)`
    },
    config: {
      mass: 1 + 0.00125 * viewHeight,
      tension: isOpen
        ? 800 * (1 + 0.007 * viewHeight)
        : 400 * (1 + 0.007 * viewHeight),
      friction: isOpen
        ? 35 * (1 + 0.005 * viewHeight)
        : 35 * (1 + 0.005 * viewHeight),
      clamp: isOpen ? false : true
    }
  });

  const Icon = Icons[`${children ? (isOpen ? "Open" : "") : "Open"}Folder`];

  return (
    <Frame>
      <div onClick={() => setOpen(!isOpen)}>
        <Icon />
        <Title className="not-selectable">{name}</Title>
      </div>
      <Content
        style={{
          opacity,
          height: isOpen && previous === isOpen ? "auto" : height
        }}
      >
        <a.div style={{ transform }} {...bind} children={children} />
      </Content>
    </Frame>
  );
});
