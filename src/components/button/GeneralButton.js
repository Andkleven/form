import React from "react";
import Button from "react-bootstrap/Button";

export default props => (
  <Button variant="light" className="text-dark border w-100">
    {props.icon && <i className={`fal fa-${props.icon} mr-1`} />}
    {props.children}
  </Button>
);
