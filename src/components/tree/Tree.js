import React, { memo, useState } from "react";
import { useSpring, a } from "react-spring";
import { useMeasure, usePrevious } from "./helpers";
import { Frame, Title, Content } from "./styles";
import * as Icons from "./icons";
import { Button } from "react-bootstrap";
import Input from "components/Input";

export default memo(
  ({ id, children, name, style, link, check, defaultOpen = false }) => {
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
          {link ? (
            <Button
              variant="light"
              size="sm"
              className="w-100 border"
              href={`${link}`}
            >
              {name}
            </Button>
          ) : check ? (
            <div className="ml-1">
              <Input className="" tight type="checkbox" label={name} />
            </div>
          ) : (
            <>
              <div onClick={() => setOpen(!isOpen)}>
                <Icon />
                <Title style={style}>{name}</Title>
              </div>
              <Content
                style={{
                  opacity,
                  height: isOpen && previous === isOpen ? "auto" : height
                }}
              >
                <a.div style={{ transform }} {...bind} children={children} />
              </Content>
            </>
          )}
        </Frame>
      </>
    );
  }
);
