import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { tinyShadow } from "styles/styles";

export default props => {
  const styles = !props.buttonGroup && tinyShadow;
  return (
    <OverlayTrigger
      delay={{ show: 1000, hide: 0 }}
      overlay={
        <Tooltip hidden={props.tooltip ? false : true}>{props.tooltip}</Tooltip>
      }
    >
      <Button
        variant="superLight"
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
        {...props}
        style={{
          border: "solid",
          borderWidth: 1,
          borderColor: "rgba(0, 0, 0, 0.1)",
          ...styles,
          ...props.style
        }}
      >
        {props.icon && (
          <FontAwesomeIcon
            icon={props.icon}
            className={`${props.children && "mr-2"} ${props.iconClassName}`}
            size={props.iconSize}
            style={props.iconStyle}
          />
        )}
        {props.children}
      </Button>
    </OverlayTrigger>
  );
};
