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
      from: { height: 0, opacity: 0, transform: "translate3d(20px,0,0)" },
      to: {
        height: isOpen ? viewHeight * 1.0 : 0,
        opacity: isOpen ? 1 : 0,
        transform: `translate3d(${isOpen ? 0 : 20}px,0,0)`
      }
    });
    const Icon = Icons[`${children ? (isOpen ? "Open" : "") : "Open"}Folder`];

    return (
      <>
        <Frame>
          <div onClick={() => setOpen(!isOpen)}>
            <Icon />
            <Title>{name}</Title>
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
