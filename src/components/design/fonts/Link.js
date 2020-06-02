import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default ({
  to = "#",
  onClick,
  children,
  iconProps,
  tooltip,
  ...props
}) => {
  return (
    <OverlayTrigger
      delay={{ show: 1000, hide: 0 }}
      overlay={<Tooltip hidden={tooltip ? false : true}>{tooltip}</Tooltip>}
    >
      <Link
        className={`d-flex not-selectable text-light text-decoration-none ${props.className}`}
        to={to}
        onClick={onClick}
        {...props}
        style={props.style}
      >
        <div className="pb-1 pt-2 not-selectable">
          <FontAwesomeIcon {...iconProps} />
          {children}
        </div>
      </Link>
    </OverlayTrigger>
  );
};
