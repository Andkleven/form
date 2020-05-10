import React from "react";
import Tree from "components/search/components/Tree";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/pro-solid-svg-icons";

const itemIconStyle = {
  color: "#bbbbbb",
  position: "relative",
  right: "0.25em",
  width: "1.5em",
  textAlign: "center"
};

// const countProjectItems = project => {
//   let numItems = 0;
//   project.descriptions.forEach(description => {
//     console.log(description.items.length);
//     numItems += description.items.length;
//   });
//   return numItems;
// };

export default ({
  data,
  iconSize,
  iconStyle,
  rowStyle,
  headline = "Projects",
  ...props
}) => {
  const linkStyle = {
    color: "#dddddd",
    ...rowStyle
  };

  return (
    <>
      {headline && <h6 className="mb-0">{headline}</h6>}
      {data && data.length > 0 ? (
        data.map((project, indexProject) => (
          <Tree
            iconSize={iconSize}
            iconStyle={iconStyle}
            rowStyle={rowStyle}
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
                  iconSize={iconSize}
                  iconStyle={iconStyle}
                  rowStyle={rowStyle}
                  defaultOpen
                  key={`project${indexProject}Description${indexDescription}`}
                  // name={description.data.geometry}
                  name={`Description ${indexDescription + 1}`}
                >
                  {description.items.length > 1 && (
                    <Link
                      className="d-flex not-selectable align-items-center"
                      to={`/order/item/${description.data.description}`}
                      style={linkStyle}
                    >
                      <div className="not-selectable">
                        <FontAwesomeIcon
                          icon={["fad", "cubes"]}
                          size="lg"
                          style={iconStyle}
                        />
                        Batch items
                      </div>
                    </Link>
                  )}
                  {description.items &&
                    description.items.map((item, indexItem) => (
                      <Link
                        className="d-flex align-items-center"
                        to={`/order/lead-engineer/1/${item.id}/1`}
                        key={`project${indexProject}Description${indexDescription}Item${indexItem}`}
                        style={linkStyle}
                      >
                        <div className="not-selectable">
                          <FontAwesomeIcon
                            icon={["fad", "cube"]}
                            size="lg"
                            style={iconStyle}
                          />
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
