import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default props => (
  <span>
    <FontAwesomeIcon icon="copyright" />
    {` ${new Date().getFullYear()} `}
    {props.link ? (
      <a href="https://www.trelleborg.com/" className="font-weight-bold">
        {"Trelleborg"}
      </a>
    ) : (
      "Trelleborg"
    )}
  </span>
);
