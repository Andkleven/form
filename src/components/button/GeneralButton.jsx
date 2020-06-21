import React from "react";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default props => {
  return (
    <OverlayTrigger
      delay={{ show: 1000, hide: 0 }}
      overlay={
        <Tooltip hidden={props.tooltip ? false : true}>{props.tooltip}</Tooltip>
      }
    >
      <Button
        size={props.buttonSize}
        variant="light"
        {...props}
        className={`${
          !(
            props.variant ||
            (props.className && props.className.includes("text-"))
          ) && `text-dark`
        } ${!props.variant && `border`} ${!props.short && "w-100"} d-flex 
      align-items-center ${
        props.className &&
        !props.className.includes("justify-content-") &&
        "justify-content-center"
      } ${props.className}`}
      >
        {props.icon && (
          <FontAwesomeIcon
            icon={props.icon}
            className={props.children && "mr-2"}
            size={props.iconSize}
            style={props.iconStyle}
          />
        )}
        {props.children}
      </Button>
    </OverlayTrigger>
  );
};
