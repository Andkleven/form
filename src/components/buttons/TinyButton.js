import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

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
        style={{ minWidth: props.noPadding ? `` : `1.8em` }}
      >
        <span className={`${props.color && `text-${props.color}`}`}>
          {props.icon && <i className={`fas fa-${props.icon}`} />}
          {props.content && ` ${props.content}`}
        </span>
      </Button>
    </OverlayTrigger>
  );
};
