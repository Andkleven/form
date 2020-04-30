import React from "react";
import Tree from "components/tree/components/Tree";
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

// const countProjectItems = project => {
//   let numItems = 0;
//   project.descriptions.forEach(description => {
//     console.log(description.items.length);
//     numItems += description.items.length;
//   });
//   return numItems;
// };

export default props => {
  return (
    <>
      <h6 className="mb-0">Projects</h6>
      {props.data && props.data.length > 0 ? (
        props.data.map((project, indexProject) => (
          <Tree
            defaultOpen
            key={`project${indexProject}`}
            name={
              `${project.data.projectName}`
              // + `(${countProjectItems(project)} items)`
            }
          >
            {project.descriptions &&
              project.descriptions.map((description, indexDescription) => (
                <Tree
                  defaultOpen
                  key={`project${indexProject}Description${indexDescription}`}
                  // name={description.data.geometry}
                  name={`Description ${indexDescription + 1}`}
                >
                  <Link
                    className="d-flex not-selectable"
                    to={`/order/item/${description.data.description}`}
                    style={linkStyle}
                  >
                    {description.items.length > 1 && (
                      <div className="pt-2 not-selectable">
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
                        <div className="pt-2 not-selectable">
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
          <em>No items found.</em>
        </div>
      )}
    </>
  );
};
