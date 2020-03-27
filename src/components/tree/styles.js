import styled from "styled-components";
import { animated } from "react-spring";

export const Frame = styled("div")`
  position: relative;
  padding: 4px 0px 0px 0px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  vertical-align: middle;
  /* color: black; */
  /* fill: lightgray; */
`;

export const Title = styled("span")`
  vertical-align: middle;
`;

export const Content = styled(animated.div)`
  will-change: transform, opacity, height;
  margin-left: 6px;
  padding: 0px 0px 0px 14px;
  border-left: 1.5px solid rgba(255, 255, 255, 0.025);
  overflow: hidden;
`;

export const toggle = {
  width: "1em",
  height: "1em",
  marginRight: 10,
  cursor: "pointer",
  verticalAlign: "middle"
};
