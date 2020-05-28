import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default ({ to = "#", onClick, children, iconProps, ...props }) => {
  return (
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
  );
};
