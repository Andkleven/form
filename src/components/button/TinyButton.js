import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default props => {
  return (
    <OverlayTrigger
      overlay={
        <Tooltip hidden={props.tooltip ? false : true}>{props.tooltip}</Tooltip>
      }
    >
      <Button
        variant="link"
        className={`py-0 m-0 ${props.noPadding ? `px-0` : `px-1`} text-center ${
          props.className
        }`}
        onClick={props.onClick}
        style={{ minWidth: props.noPadding ? `` : `1.8em`, ...props }}
      >
        <span className={`${props.color && `text-${props.color}`}`}>
          {props.icon && (
            <FontAwesomeIcon
              icon={props.icon}
              size={props.iconSize || ""}
              style={props.iconStyle}
            />
          )}
          <div className="ml-1 d-inline">{props.children}</div>
        </span>
      </Button>
    </OverlayTrigger>
  );
};
