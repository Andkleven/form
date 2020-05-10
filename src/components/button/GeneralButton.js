import React from "react";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default props => {
  return (
    <Button
      variant="light"
      {...props}
      className={`${
        !(props.variant || props.className.includes("text-")) && `text-dark`
      } ${!props.variant && `border`} w-100 ${props.className}`}
    >
      {props.icon && <FontAwesomeIcon icon={props.icon} className="mr-1" />}
      {props.children}
    </Button>
  );
};
