import React from "react";
import { ButtonGroup } from "react-bootstrap";
import { tinyShadow } from "../styles/styles";

export default props => {
  return (
    <div style={props.style} className={`w-100 ${props.outerClass}`}>
      <ButtonGroup
        {...props}
        // buttonGroup={buttonGroup}
        className={`p-0 rounded ${props.className}`}
        style={tinyShadow}
      >
        {props.children}
      </ButtonGroup>
    </div>
  );
};
