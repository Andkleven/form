import React from "react";
import Tree from "components/explorer/components/Tree";
import Link from "../../design/fonts/Link";
import ItemGrid from "components/layout/ItemGrid";
import { Col, ProgressBar } from "react-bootstrap";
import { progress, displayStage } from "functions/progress";
import { useMutation } from "react-apollo";
import mutations from "graphql/mutation";
import query from "graphql/query";
import { numberOfChildren } from "../functions/data.js";

export default ({
  results, // Search results (JSON-object)
  data, // Original (JSON-object)
  iconSize,
  iconStyle,
  rowStyle,
  headline = "Projects",
  refetch,
  stage = false,
  ...props
}) => {
  // Delete projects
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
  const [deleteProject] = useMutation(mutations["DELETE_PROJECT"], {
    update: deleteProjectFromCache
  });

  return (
    <div className={props.className}>
      {headline && <h6>{headline}</h6>}
      {props.access && props.access.specs && (
        <Link
          to="/project/0"
          iconProps={{
            icon: ["fad", "folder-plus"],
            size: iconSize,
            style: iconStyle
          }}
          style={rowStyle}
          force
        >
          Create new project
        </Link>
      )}
      {results && results.length > 0 ? (
        results.map((project, indexProject) => (
          <Tree
            iconSize={iconSize}
            iconStyle={iconStyle}
            rowStyle={rowStyle}
            defaultOpen
            key={`${project.data.projectName}${indexProject}`}
            name={
              <div className="text-wrap">
                {project.data.projectName}

                <div className="d-inline text-secondary">
                  {`${
                    (numberOfChildren(data, project.data.projectName) &&
                      ` ∙ ${project.descriptions.length}/${numberOfChildren(
                        data,
                        project.data.projectName
                      )} Descriptions`) ||
                    " ∙ No descriptions"
                  }`}
                </div>
              </div>
              // + `(${countProjectItems(project)} items)`
            }
          >
            {props.access && props.access.specs && (
              <>
                <div className="d-flex align-items-center flex-wrap">
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
                  </Link>
                  <Link
                    tooltip="Delete project"
                    to={`#`}
                    color="danger"
                    key={`project${indexProject}DeleteLinkButton`}
                    iconProps={{
                      icon: ["fas", "trash-alt"],
                      size: iconSize,
                      style: iconStyle
                    }}
                    style={{ ...rowStyle }}
                    onClick={() => {
                      const confirmation = window.prompt(
                        "To delete a project is irreversible. Enter the project name to confirm deletion:",
                        ""
                      );
                      if (
                        confirmation === project.data.projectName &&
                        window.confirm(
                          `Are you sure? The project "${project.data.projectName}" will be gone forever.\nTip: You may need to refresh the browser to see the changes.`
                        )
                      ) {
                        deleteProject({ variables: { id: project.id } });
                        // window.location.reload(false);
                        refetch();
                      } else if (
                        confirmation !== project.data.projectName &&
                        confirmation !== null
                      ) {
                        alert(
                          "Entered name doesn't match. Project not deleted."
                        );
                      }
                    }}
                  >
                    Delete project
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
                </div>
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
                  name={
                    <div className="text-wrap">
                      {description.data.description}
                      <div className="d-inline text-secondary">
                        {` ∙ ${description.data.geometry}${
                          (numberOfChildren(
                            data,
                            project.data.projectName,
                            description.data.description
                          ) &&
                            ` ∙ ${description.items.length}/${numberOfChildren(
                              data,
                              project.data.projectName,
                              description.data.description
                            )} Items`) ||
                          " ∙ No items"
                        }`}
                      </div>
                    </div>
                  }
                >
                  {!!stage &&
                    !["leadEngineer", "qualityControl"].includes(stage) && (
                      <div className="d-flex align-items-center flex-wrap mb-2">
                        <Link
                          // to={`/project/${project.id}`}
                          to={`/batching/${stage}/${project.id}/${description.data.description}/${description.data.geometry}`}
                          key={`project${indexProject}`}
                          iconProps={{
                            icon: ["fad", "cubes"],
                            size: iconSize,
                            style: iconStyle
                          }}
                          style={{ marginRight: "2em", ...rowStyle }}
                        >
                          Batching
                        </Link>
                        <Link
                          // to={`/project/${project.id}`}
                          to={`/partial-batching/${stage}/${description.data.description}/${description.data.geometry}`}
                          key={`project${indexProject}`}
                          iconProps={{
                            icon: ["far", "cubes"],
                            size: iconSize,
                            style: iconStyle,
                            className: "text-secondary"
                          }}
                          style={{ marginRight: "2em", ...rowStyle }}
                        >
                          Partial batching
                        </Link>
                      </div>
                    )}
                  <ItemGrid className="mb-n3">
                    {props.access &&
                      (props.access.itemRead || props.access.itemWrite) &&
                      description.items &&
                      description.items.map((item, indexItem) => (
                        <Col
                          key={`itemContainer${indexItem}`}
                          xs="12"
                          md="6"
                          lg="4"
                          className="text-truncate pr-5 mb-3"
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
