import React, { memo, useState } from "react";
import { useSpring, a } from "react-spring";
import { useMeasure, usePrevious } from "./helpers";
import { Frame, Title, Content } from "./styles";
import * as Icons from "./icons";

export default memo(
  ({ id, children, name, style, link, check, item, defaultOpen = false }) => {
    const [isOpen, setOpen] = useState(defaultOpen);
    const previous = usePrevious(isOpen);
    const [bind, { height: viewHeight }] = useMeasure();
    const { height, opacity, transform } = useSpring({
      config: {
        mass: 1.5,
        tension: isOpen ? 800 : 600,
        friction: isOpen ? 35 : 50,
        clamp: isOpen ? false : true
      },
      from: {
        height: 0,
        opacity: 0,
        transform: "translate3d(0,-3px,0)"
      },
      to: {
        height: isOpen ? viewHeight * 1 : 0,
        opacity: isOpen ? 1 : 0,
        transform: `translate3d(0px,${isOpen ? 0 : -3}px,0)`
      }
    });
    const Icon = Icons[`${children ? (isOpen ? "Open" : "") : "Open"}Folder`];

    return (
      <>
        <Frame>
          <div onClick={() => setOpen(!isOpen)}>
            <Icon />
            <Title className="unselectable">{name}</Title>
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
      </>
    );
  }
);
