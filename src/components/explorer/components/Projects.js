import React from "react";
import Tree from "components/explorer/components/Tree";
import Link from "../../design/fonts/Link";
import ItemGrid from "components/layout/ItemGrid";

export default ({
  data,
  iconSize,
  iconStyle,
  rowStyle,
  headline = "Projects",
  ...props
}) => {
  return (
    <div className={props.className}>
      {headline && <h6>{headline}</h6>}
      {props.access && props.access.specs && (
        <Link
          to={`/order/project/0`}
          iconProps={{
            icon: ["fad", "folder-plus"],
            size: iconSize,
            style: iconStyle
          }}
          style={rowStyle}
        >
          Create new project
        </Link>
      )}
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
            {props.access && props.access.specs && (
              <Link
                to={`/order/project/${project.id}`}
                key={`project${indexProject}`}
                iconProps={{
                  icon: ["fad", "file-invoice"],
                  swapOpacity: true,
                  size: iconSize,
                  style: iconStyle
                }}
                style={rowStyle}
              >
                Specifications
                {/* {project.data.projectName} */}
              </Link>
            )}
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
                  <ItemGrid>
                    {props.access &&
                      (props.access.itemRead || props.access.itemWrite) &&
                      description.items &&
                      description.items.map((item, indexItem) => (
                        <Link
                          to={`/single-item/${item.id}/${description.data.geometry}`}
                          key={`project${indexProject}Description${indexDescription}Item${indexItem}`}
                          iconProps={{
                            icon: ["fad", "cube"],
                            size: iconSize,
                            style: iconStyle
                          }}
                          className="mr-5"
                          style={{ rowStyle, iconStyle }}
                        >
                          {item.id}
                        </Link>
                      ))}
                  </ItemGrid>
                </Tree>
              ))}
          </Tree>
        ))
      ) : (
        <div className="pt-1 text-secondary">
          <em>No projects found.</em>
        </div>
      )}
    </div>
  );
};
