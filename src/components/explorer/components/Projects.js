import React from "react";
import Tree from "components/explorer/components/Tree";
import Link from "../../design/fonts/Link";
import ItemGrid from "components/layout/ItemGrid";
import { Col, ProgressBar } from "react-bootstrap";
import { camelCaseToNormal } from "functions/general";
import { progress, displayStage } from "functions/progress";

export default ({
  data,
  iconSize,
  iconStyle,
  rowStyle,
  headline = "Projects",
  ...props
}) => {
  console.log(data);

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
                  name={`${description.data.description}`}
                >
                  <ItemGrid>
                    {props.access &&
                      (props.access.itemRead || props.access.itemWrite) &&
                      description.items &&
                      description.items.map((item, indexItem) => (
                        <Col
                          xs="12"
                          md="6"
                          lg="4"
                          className="text-truncate pr-5 mb-4"
                        >
                          <Link
                            to={`/single-item/${item.id}/${description.data.geometry}`}
                            key={`project${indexProject}Description${indexDescription}Item${indexItem}`}
                            iconProps={{
                              icon: ["fad", "cube"],
                              size: iconSize,
                              style: iconStyle
                            }}
                            style={{ zIndex: 1, ...rowStyle }}
                            className="text-light text-wrap text-decoration-none"
                          >
                            <div className="d-inline w-100">
                              {item.itemId ? (
                                item.itemId
                              ) : (
                                <div className="text-secondary d-inline">
                                  No Item ID (Index ID: {item.id})
                                </div>
                              )}
                              <ProgressBar
                                animated
                                variant="info"
                                now={progress(item)}
                                className="mt-2 shadow-sm w-100"
                                style={{
                                  height: "1.5em",
                                  backgroundColor: "rgba(0, 0, 0, 0.25)"
                                }}
                              />
                              <div
                                align="center"
                                style={{
                                  position: "relative",
                                  bottom: "1.4em",
                                  height: 0,
                                  zIndex: 0
                                }}
                              >
                                <small className="text-decoration-none">
                                  {displayStage(item)}
                                </small>
                              </div>
                            </div>
                          </Link>
                        </Col>
                      ))}
                  </ItemGrid>
                </Tree>
                // <Tree
                //   iconSize={iconSize}
                //   iconStyle={iconStyle}
                //   rowStyle={rowStyle}
                //   defaultOpen
                //   key={`project${indexProject}Description${indexDescription}`}
                //   // name={description.data.geometry}
                //   name={`Description ${indexDescription + 1}`}
                // >
                //   <ItemGrid>
                //     {props.access &&
                //       (props.access.itemRead || props.access.itemWrite) &&
                //       description.items &&
                //       description.items.map((item, indexItem) => (
                //         <Link
                //           to={`/single-item/${item.id}/${description.data.geometry}`}
                //           key={`project${indexProject}Description${indexDescription}Item${indexItem}`}
                //           iconProps={{
                //             icon: ["fad", "cube"],
                //             size: iconSize,
                //             style: iconStyle
                //           }}
                //           style={rowStyle}
                //         >
                //           {item.id}
                //         </Link>
                //       ))}
                //   </ItemGrid>
                // </Tree>
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
