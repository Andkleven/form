import React from "react";
import Copyright from "components/design/Copyright";

export default props => {
  return (
    <footer
      {...props}
      className={`text-center text-light py-3 ${props.className}`}
      // align="center"
    >
      <Copyright showLink />
    </footer>
  );
};
