import React from "react";
import { Link } from "react-router-dom";

const itemIconStyle = {
  // color: "#bbbbbb",
  color: "#f1b25b",
  position: "relative",
  right: "0.25em",
  width: "1.5em",
  textAlign: "center"
};

const linkStyle = {
  color: "#dddddd"
};

export default props => {
  return (
    <>
      <h6 className="mb-0">Projects</h6>
      {props.data && props.data.length > 0 ? (
        props.data.map((project, indexProject) => (
          <Link
            key={`project${indexProject}`}
            className="d-flex unselectable"
            to={`#`}
            style={linkStyle}
          >
            <div className="pt-2 unselectable">
              <i className="fas fa-folder" style={itemIconStyle} />
              {project.data.projectName}
            </div>
          </Link>
        ))
      ) : (
        <div className="pt-1">No projects found.</div>
      )}
    </>
  );
};
