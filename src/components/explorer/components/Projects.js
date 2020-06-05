import React from "react";
import Tree from "components/explorer/components/Tree";
import Link from "../../design/fonts/Link";
import ItemGrid from "components/layout/ItemGrid";
import { Col, ProgressBar } from "react-bootstrap";
import { progress, displayStage } from "functions/progress";
import { useMutation } from "react-apollo";
import mutations from "graphql/mutation";
import query from "graphql/query";

export default ({
  data,
  iconSize,
  iconStyle,
  rowStyle,
  headline = "Projects",
  ...props
}) => {
  const deleteProjectFromCache = (
    cache,
    {
      data: {
        projectDelete: { deleted }
      }
    }
  ) => {
    const oldData = cache.readQuery({
      query: query["OPERATOR_PROJECTS"]
    });
    const newData = oldData.projects.filter(
      project => String(project.id) !== String(deleted)
    );
    cache.writeQuery({
      query: query["OPERATOR_PROJECTS"],
      data: { projects: newData.projects }
    });
  };

  const [deleteProject] = useMutation(
    mutations["DELETE_PROJECT"],
    {
      update: deleteProjectFromCache
    }
  );

  return (
    <div className={props.className}>
      {headline && <h6>{headline}</h6>}
      {props.access && props.access.specs && (
        <Link
          to={`/project/0`}
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
              <>
                {/* <div className="d-flex align-items-center"> */}
                <Link
                  to={`/project/${project.id}`}
                  key={`project${indexProject}`}
                  iconProps={{
                    icon: ["fad", "file-invoice"],
                    swapOpacity: true,
                    size: iconSize,
                    style: iconStyle
                  }}
                  style={{ marginRight: "2em", ...rowStyle }}
                >
                  Specifications
                  {/* {project.data.projectName} */}
                </Link>
                <Link
                  to={`#`}
                  key={`project${indexProject}DeleteLinkButton`}
                  iconProps={{
                    icon: ["fad", "trash-alt"],
                    swapOpacity: true,
                    size: iconSize,
                    style: iconStyle,
                    className: "text-danger"
                  }}
                  style={{ marginRight: "1em", ...rowStyle }}
                  onClick={() => {
                    if (
                      window.confirm(
                        "To delete a project is irreversible - are you sure?"
                      )
                    ) {
                      deleteProject({ variables: { id: project.id } });
                      window.location.reload(false);
                    }
                  }}
                >
                  Delete
                </Link>
                {/* <Button
                  variant="danger"
                  style={{ height: "2em", marginRight: "1em" }}
                  key={`project${indexProject}Delete`}
                  className="d-flex align-items-center"
                  onClick={() => {
                    deleteProject({ variables: { id: project.id } });
                    window.location.reload(false);
                  }}
                >
                  <FontAwesomeIcon icon="trash-alt" className="mr-2" /> Delete
                </Button> */}
                {/* </div> */}
              </>
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
                            className="text-light text-wrap text-decoration-none w-100"
                          >
                            <div className="d-inline">
                              <div className="d-inline text-light">
                                {item.itemId ? (
                                  item.itemId
                                ) : (
                                  <div className="text-secondary d-inline">
                                    No Item ID (Index ID: {item.id})
                                  </div>
                                )}
                              </div>
                              <ProgressBar
                                animated
                                variant="success"
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
                                  zIndex: 0,
                                  opacity: 0.75
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
