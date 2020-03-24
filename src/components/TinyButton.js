import React from "react";
import { Button } from "react-bootstrap";

export default props => {
  return (
    <Button variant="link" className="py-0 m-0" onClick={props.onClick}>
      <span className={props.color && `text-${props.color}`}>
        {props.icon && <i className={`far fa-${props.icon} fa-sm`} />}
        {props.text && ` ${props.text}`}
      </span>
    </Button>
  );
};
