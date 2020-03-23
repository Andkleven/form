import React from "react";
import Tree from "components/tree/Tree";
import { Link } from "react-router-dom";

const itemIconStyle = {
  color: "#bbbbbb",
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
          <Tree
            defaultOpen
            key={`project${indexProject}`}
            name={project.data.projectName}
          >
            {project.descriptions &&
              project.descriptions.map((description, indexDescription) => (
                <Tree
                  defaultOpen
                  key={`project${indexProject}Description${indexDescription}`}
                  name={description.data.geometry}
                >
                  <Link
                    className="d-flex unselectable"
                    to={`/order/item/${description.data.description}`}
                    style={linkStyle}
                  >
                    {description.items.length > 1 && (
                      <div className="pt-2 unselectable">
                        <i className="fad fa-cubes" style={itemIconStyle} />
                        Batch items
                      </div>
                    )}
                  </Link>
                  {description.items &&
                    description.items.map((item, indexItem) => (
                      <Link
                        className="d-flex"
                        to={`/order/lead-engineer/1/${item.id}/1`}
                        key={`project${indexProject}Description${indexDescription}Item${indexItem}`}
                        style={linkStyle}
                      >
                        <div className="pt-2 unselectable">
                          <i className="fad fa-cube" style={itemIconStyle} />
                          {item.id}
                        </div>
                      </Link>
                    ))}
                </Tree>
              ))}
          </Tree>
        ))
      ) : (
        <div className="pt-1">
          <em>No projects found.</em>
        </div>
      )}
    </>
  );
};
