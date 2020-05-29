import React from "react";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default props => {
  return (
    <Button
      size={props.buttonSize}
      variant="light"
      {...props}
      className={`${
        !(props.variant || props.className.includes("text-")) && `text-dark`
      } ${!props.variant && `border`} w-100 ${props.className}`}
    >
      {props.icon && (
        <FontAwesomeIcon
          icon={props.icon}
          className="mr-2"
          size={props.iconSize}
          style={props.iconStyle}
        />
      )}
      {props.children}
    </Button>
  );
};
