import React, { memo, useState, useEffect } from "react";
import { useSpring, a } from "react-spring";
import { useMeasure } from "../styles/helpers";
import { Frame, Title, Content } from "../styles/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default memo(
  ({
    children,
    name,
    defaultOpen = false,
    iconSize,
    iconStyle,
    rowStyle,
    isNew,
    isDone
  }) => {
    const [isOpen, setOpen] = useState(defaultOpen);

    // const previous = usePrevious(isOpen);
    const [bind, { height: viewHeight }] = useMeasure();
    const {
      //  height,
      opacity,
      transform
    } = useSpring({
      from: {
        opacity: 0
        // transform: "translate3d(0,-0px,0)"
        // height: 0
      },
      to: {
        opacity: isOpen ? 1 : 0
        // transform: `translate3d(0px,${isOpen ? 0 : -0}px,0)`
        // height: isOpen ? viewHeight * 1 : 0
      },
      config: {
        tension: 400,
        // ?   10000
        // : 10000,
        friction: 35,
        // ?  0.01
        // : 0.01,
        // clamp: isOpen ? false : true,
        clamp: true,
        mass: isOpen ? 0.5 : 0.01
        // mass: 0.01
      }
    });

    const icon = `${
      children &&
      (isOpen
        ? `${!!isNew ? `folder-open` : `folder-open`}`
        : `${!!isNew ? `folder` : `folder`}`)
    }`;

    useEffect(() => {
      if (defaultOpen) {
        setOpen(true);
      } else if (!defaultOpen) {
        setOpen(false);
      }
    }, [defaultOpen]);

    return (
      <Frame>
        <div
          onClick={() => setOpen(!isOpen)}
          className="d-flex align-items-center"
          style={rowStyle}
        >
          <FontAwesomeIcon
            icon={icon}
            size={iconSize}
            className={
              isDone ? `text-success` : !!isNew ? `text-info` : `text-primary`
            }
            style={iconStyle}
          />
          {!!isNew && (
            <div style={{ height: 0, width: 0 }}>
              <FontAwesomeIcon
                icon={`sparkles`}
                size={`xs`}
                className={``}
                style={{
                  position: "relative",
                  right: "1.55em",
                  bottom: "1.65em"
                }}
              />
            </div>
          )}
          <Title className="not-selectable">{name}</Title>
          {/* {!isOpen && !!isNew && (
            <div
              className="d-flex justify-content-center px-1"
              style={{ width: "5em" }}
            >
              {isNew}
            </div>
          )} */}
        </div>
        <Content
          style={{
            opacity,
            // height: isOpen && previous === isOpen ? "auto" : height
            height: isOpen ? viewHeight * 1 : 0
          }}
        >
          <a.div style={{ transform }} {...bind} children={children} />
        </Content>
      </Frame>
    );
  }
);
