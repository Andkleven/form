import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default ({
  icon = "folder",
  to = "#",
  onClick,
  children,
  iconSize,
  iconStyle
}) => {
  return (
    <Link
      className="d-flex not-selectable"
      style={{ color: "#dddddd" }}
      to={to}
      onClick={onClick}
    >
      <div className="pb-1 pt-2 not-selectable">
        <FontAwesomeIcon
          icon={icon}
          size={iconSize}
          className={`text-primary`}
          style={iconStyle}
        />
        {children}
      </div>
    </Link>
  );
};
