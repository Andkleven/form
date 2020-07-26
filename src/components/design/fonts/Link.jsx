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
  color,
  force,
  ...props
}) => {
  return (
    <OverlayTrigger
      delay={{ show: 1000, hide: 0 }}
      overlay={<Tooltip hidden={tooltip ? false : true}>{tooltip}</Tooltip>}
    >
      {force ? (
        <div className={`${props.className}`} style={props.style}>
          <a
            variant="link"
            className={`d-flex m-0 p-0 text-${
              color || "light"
            } text-decoration-none`}
            href={to}
            onClick={onClick}
            {...props}
          >
            <div className="pb-1 pt-2 not-selectable">
              <FontAwesomeIcon {...iconProps} />
              {children}
            </div>
          </a>
        </div>
      ) : (
        <div className={`${props.className}`} style={props.style}>
          <Link
            className={`d-flex not-selectable text-${
              color || "light"
            } text-decoration-none`}
            to={to}
            onClick={onClick}
            {...props}
          >
            <div className="pb-1 pt-2 not-selectable">
              <FontAwesomeIcon {...iconProps} />
              {children}
            </div>
          </Link>
        </div>
      )}
    </OverlayTrigger>
  );
};
