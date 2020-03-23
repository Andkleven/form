import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ProjectContext } from "components/tree/ProjectContext";

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
  const [projectId, setProjectId] = useContext(ProjectContext);
  return (
    <>
      <h6 className="mb-0">Projects</h6>
      <Link
        className="d-flex unselectable"
        style={linkStyle}
        to="#"
        onClick={() => setProjectId(0)}
      >
        <div className="pt-2 unselectable">
          <i className="fad fa-folder-plus" style={itemIconStyle} />
          Create new project
        </div>
      </Link>
      {props.data && props.data.length > 0 ? (
        props.data.map((project, indexProject) => (
          <Link
            key={`project${indexProject}`}
            className="d-flex unselectable"
            style={linkStyle}
            to="#"
            onClick={() => setProjectId(project.id)}
          >
            <div className="pt-2 unselectable">
              <i className="fas fa-folder" style={itemIconStyle} />
              {project.data.projectName}
            </div>
          </Link>
        ))
      ) : (
        <div className="pt-1">
          <em>No projects found.</em>
        </div>
      )}
    </>
  );
};
