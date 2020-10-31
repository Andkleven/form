import React from "react";
import Tree from "components/explorer/components/Tree";
import Link from "../../design/fonts/Link";
import ItemGrid from "components/layout/ItemGrid";
import { Col, ProgressBar, Button } from "react-bootstrap";
import { progress, displayStage } from "functions/progress";
import { useMutation } from "react-apollo";
import mutations from "graphql/mutation";
import query from "graphql/query";
import { numberOfChildren } from "../functions/data.js";
import batching from "templates/batching.json";
import { getUser } from "functions/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReportButton } from "./Projects/ReportButton";
import Badge from "components/design/NotificationBadge";
import gql from "graphql-tag";

const NoItemsFound = ({ show }) => {
  return (
    <>
      {show && (
        <div className="pt-1 text-secondary">
          <em>No items found.</em>
        </div>
      )}
    </>
  );
};

export default ({
  results, // Search results (JSON-object)
  data, // Original (JSON-object)
  iconSize,
  iconStyle,
  rowStyle,
  headline = "Projects",
  refetch,
  stage = false,
  searchActive = false,
  ...props
}) => {
  // Delete projects
  const user = getUser();
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
      project => String(project["id"]) !== String(deleted)
    );
    cache.writeQuery({
      query: query["OPERATOR_PROJECTS"],
      data: { projects: newData.projects }
    });
  };
  const [deleteProject] = useMutation(mutations["DELETE_PROJECT"], {
    update: deleteProjectFromCache
  });

  // const update = (cache, { data: { copyProject } }) => {
  //   const oldData = cache.readQuery({
  //     query: query["OPERATOR_PROJECTS"]
  //   });
  //   oldData.projects.push(copyProject.new);
  //   cache.writeQuery({
  //     query: query["OPERATOR_PROJECTS"],
  //     data: { ...oldData }
  //   });
  // };

  // const COPY_PROJECT = gql`
  //   mutation($id: Int) {
  //     copyProject(id: $id) {
  //       new {
  //         id
  //         leadEngineerDone
  //         data
  //         descriptions {
  //           id
  //           data
  //           items {
  //             id
  //             itemId
  //             stage
  //             seen {
  //               id
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // `;

  // const [copyProject, { loading }] = useMutation(COPY_PROJECT, {
  //   update
  // });

  // Notification badge logic
  // _______________________________________________________________________
  // Check for new items
  const newItem = item => {
    const scenarios = [
      ["QUALITY"].includes(user.role) && item.stage === "finalInspection",
      ["ADMIN"].includes(user.role)
    ];

    if (scenarios.includes(true)) {
      let result = true;

      item.seen &&
        item.seen.forEach(seen => {
          if (seen.seen === user.username) {
            result = false;
          }
        });

      return result;
    }

    return false;
  };
  const newInDescription = (description, user) => {
    let result = false;
    description &&
      description.items &&
      description.items.forEach(item => {
        if (newItem(item, user)) {
          result = true;
        }
      });
    return result;
  };
  const newInProject = (project, user) => {
    let result = false;
    project &&
      project.descriptions &&
      project.descriptions.forEach(description => {
        if (newInDescription(description, user)) {
          result = true;
        }
      });
    return result;
  };

  // Check for done items
  const doneItem = item => {
    const done = item.stage === "done";

    return done;
  };
  const doneDescription = description => {
    let result = true;

    if (description && description.items && description.items.length === 0) {
      result = false;
    }

    description &&
      description.items &&
      description.items.forEach(item => {
        if (!doneItem(item)) {
          result = false;
        }
      });
    return result;
  };
  const doneProject = project => {
    let result = true;

    if (project && project.descriptions && project.descriptions.length === 0) {
      result = false;
    }

    project &&
      project.descriptions &&
      project.descriptions.forEach(description => {
        if (!doneDescription(description)) {
          result = false;
        }
      });
    return result;
  };

  // Tell backend that the item has been seen by the user (backend)
  const ADD_SEEN = gql`
    mutation item($id: Int!, $seen: [String]!) {
      item(id: $id, seen: $seen) {
        new {
          id
          seen {
            id
            seen
          }
        }
      }
    }
  `;

  const [updateSeen] = useMutation(ADD_SEEN);

  const handleItemClick = item => {
    if (newItem(item)) {
      updateSeen({
        variables: { id: parseInt(item.id), seen: [user.username] }
      });
    }
  };
  // _______________________________________________________________________

  // Sorting
  // _______________________________________________________________________
  function projectsAlphabetically(a, b) {
    // Use toUpperCase() to ignore character casing
    a = a.data.projectNumber.toUpperCase();
    b = b.data.projectNumber.toUpperCase();

    let comparison = 0;
    if (a > b) {
      comparison = 1;
    } else if (a < b) {
      comparison = -1;
    }
    return comparison;
  }
  function descriptionsAlphabetically(a, b) {
    // Use toUpperCase() to ignore character casing
    a = a.data.descriptionNameMaterialNo.toUpperCase();
    b = b.data.descriptionNameMaterialNo.toUpperCase();

    let comparison = 0;
    if (a > b) {
      comparison = 1;
    } else if (a < b) {
      comparison = -1;
    }
    return comparison;
  }
  function itemsAlphabetically(a, b) {
    // Use toUpperCase() to ignore character casing
    a = a.itemId.toUpperCase();
    b = b.itemId.toUpperCase();

    let comparison = 0;
    if (a > b) {
      comparison = 1;
    } else if (a < b) {
      comparison = -1;
    }
    return comparison;
  }

  // Sort projects
  results.sort(projectsAlphabetically);
  // Sort descriptions
  results.forEach(project => {
    project.descriptions = project.descriptions.sort(
      descriptionsAlphabetically
    );
    // Sort items
    project.descriptions.forEach(description => {
      description.items = description.items.sort(itemsAlphabetically);
    });
  });
  // _______________________________________________________________________

  // Batching stages
  const batchingStages = Object.keys(batching);
  let showNoItemsFound = true;

  return (
    <div className={props.className}>
      {headline && <h6>{headline}</h6>}
      {/* {loading && <Loading />} */}
      {props.access && props.access.specs && (
        <Link
          to="/project/0"
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
      {results && results.length > 0 ? (
        results.map((project, indexProject) => {
          return (
            <Tree
              iconSize={iconSize}
              iconStyle={iconStyle}
              rowStyle={rowStyle}
              defaultOpen={searchActive}
              key={`${project.data.projectName} ${indexProject} `}
              name={
                <div
                  className="text-wrap my-2 py-2 my-sm-1 py-sm-1"
                  style={{ wordBreak: "break-word" }}
                >
                  <b>{`${project.data.projectNumber}`}</b>
                  {` ∙ ${project.data.projectName}`}
                  <div
                    className="d-inline text-secondary"
                    style={{ wordBreak: "break-word" }}
                  >
                    {`${
                      (project.leadEngineerDone &&
                        numberOfChildren(data, project.data.projectName) &&
                        ` ∙ ${project.descriptions.length}/${numberOfChildren(
                          data,
                          project.data.projectName
                        )} Descriptions`) ||
                      ""
                      // " ∙ No descriptions"
                    } `}
                  </div>
                </div>
                // + `(${ countProjectItems(project) } items)`
              }
              isNew={project.leadEngineerDone && newInProject(project, user)}
              isDone={doneProject(project)}
            >
              <div className="d-flex align-items-center flex-wrap">
                {props.access && props.access.specs && (
                  <Link
                    to={`/project/${project.id}`}
                    key={`projectSpecs${indexProject}-1`}
                    iconProps={{
                      icon: ["fad", "file-invoice"],
                      swapOpacity: true,
                      size: iconSize,
                      style: iconStyle
                    }}
                    style={{ marginRight: ".75em", ...rowStyle }}
                  >
                    Specifications
                  </Link>
                )}
                {/* {props.access && props.access.specs && (
                  <Link
                    key={`projectSpecs${indexProject} -0`}
                    onClick={() => {
                      copyProject({ variables: { id: project.id } });
                      window.location.reload(false);
                    }}
                    iconProps={{
                      icon: ["fad", "copy"],
                      swapOpacity: true,
                      size: iconSize,
                      style: iconStyle
                    }}
                    style={{ marginRight: ".75em", ...rowStyle }}
                  >
                    Duplicate
                  </Link>
                )} */}
                {[""].map(() => {
                  let geometries = [];

                  project.descriptions &&
                    project.leadEngineerDone &&
                    project.descriptions.forEach(description => {
                      const geometry = description.data.geometry;
                      if (!geometries.includes(geometry)) {
                        geometries.push(geometry);
                      }
                    });

                  let batchable = false;

                  geometries.forEach(geometry => {
                    if (
                      batching[stage] &&
                      batching[stage]["geometry"].includes(geometry)
                    ) {
                      batchable = true;
                    }
                  });

                  return (
                    batchable &&
                    !!stage &&
                    // Array of stages with batching
                    batchingStages.includes(
                      stage.split("Step")[1]
                        ? stage.split("Step")[0] + "Step"
                        : stage
                    ) && (
                      <>
                        <Link
                          // to={`/project/${project["id"]}`}
                          to={`/batching/${stage}/${project.id}`}
                          key={`projectBatching${indexProject}`}
                          iconProps={{
                            icon: ["fad", "cubes"],
                            size: iconSize,
                            style: iconStyle
                          }}
                          style={{ marginRight: ".75em", ...rowStyle }}
                        >
                          Batching
                        </Link>
                      </>
                    )
                  );
                })}
                <Link
                  to={`#`}
                  key={`projectExport${indexProject}`}
                  iconProps={{
                    icon: ["fad", "download"],
                    swapOpacity: true,
                    size: iconSize,
                    style: iconStyle
                  }}
                  color="primary"
                  style={{ marginRight: ".75em", ...rowStyle }}
                  onClick={() => alert("Export not implemented yet.")}
                >
                  Export
                </Link>
                {props.access && props.access.specs && (
                  <Link
                    to={`#`}
                    color="danger"
                    key={`project${indexProject}DeleteLinkButton`}
                    iconProps={{
                      icon: ["fas", "trash-alt"],
                      size: iconSize,
                      style: iconStyle
                    }}
                    style={{ marginRight: ".75em", ...rowStyle }}
                    onClick={() => {
                      const confirmation = window.prompt(
                        "To delete a project is irreversible. Enter the project name to confirm deletion:",
                        ""
                      );
                      if (
                        confirmation === project.data.projectName &&
                        window.confirm(
                          `Are you sure? The project "${project.data.projectName}" will be gone forever.`
                        )
                      ) {
                        deleteProject({ variables: { id: project["id"] } });
                        window.location.reload(false);
                        // refetch();
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
                )}
              </div>
              {project.descriptions &&
                project.leadEngineerDone &&
                project.descriptions.map((description, indexDescription) => {
                  return (
                    <Tree
                      iconSize={iconSize}
                      iconStyle={iconStyle}
                      rowStyle={rowStyle}
                      defaultOpen={searchActive}
                      key={`project${indexProject}Description${indexDescription}`}
                      // name={description.data.geometry}
                      name={
                        <div className="text-wrap">
                          {description.data.descriptionNameMaterialNo}
                          <div className="d-inline text-secondary">
                            {` ∙ ${description.data.geometry}${
                              (numberOfChildren(
                                data,
                                project.data.projectName,
                                description.data.descriptionNameMaterialNo
                              ) &&
                                ` ∙ ${
                                  description.items.length
                                }/${numberOfChildren(
                                  data,
                                  project.data.projectName,
                                  description.data.descriptionNameMaterialNo
                                )} Items`) ||
                              " ∙ No items"
                            }`}
                          </div>
                        </div>
                      }
                      isNew={newInDescription(description, user)}
                      isDone={doneDescription(description)}
                    >
                      <ItemGrid className="mb-n3">
                        {props.access &&
                          (props.access.itemRead || props.access.itemWrite) &&
                          description.items &&
                          description.items.map((item, indexItem) => {
                            return (
                              <Col
                                key={`itemContainer${indexItem}`}
                                xs="12"
                                md="6"
                                lg="4"
                                className="text-truncate pr-2 mb-1 p-1"
                              >
                                {newItem(item, user) && (
                                  <div className="d-flex justify-content-end">
                                    <div
                                      style={{
                                        position: "relative",
                                        top: ".65em",
                                        right: "1.2em"
                                      }}
                                      className="d-flex justify-content-center align-items-center"
                                    >
                                      <Badge>New</Badge>
                                    </div>
                                  </div>
                                )}
                                <div
                                  className="shadow-sm p-1"
                                  style={{
                                    borderStyle: "solid",
                                    borderColor: "rgba(0, 0, 0, 0.35)",
                                    // borderColor: "red",
                                    borderRadius: ".5em",
                                    borderWidth: ".05em",
                                    backgroundColor:
                                      "rgba(255, 255, 255, 0.075)"
                                  }}
                                >
                                  <div className="px-1 mt-n1">
                                    <Link
                                      onClick={() => handleItemClick(item)}
                                      to={`/single-item/${project.id}/${description.id}/${item.id}/${description.data.geometry}`}
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
                                        <div className="d-inline">
                                          {item.itemId ? (
                                            <div
                                              className="d-inline"
                                              style={{
                                                maxWidth: "100%",
                                                wordBreak: "break-word"
                                              }}
                                            >
                                              {item.itemId}
                                            </div>
                                          ) : (
                                            <div className="text-secondary d-inline">
                                              No Item ID (Index ID: {item.id})
                                            </div>
                                          )}
                                        </div>
                                        <ProgressBar
                                          animated={progress(item) < 100}
                                          variant={
                                            progress(item) >= 100
                                              ? "success"
                                              : "primary"
                                          }
                                          now={progress(item)}
                                          className="mt-2 shadow-sm w-100"
                                          style={{
                                            height: "1.5em",
                                            backgroundColor:
                                              "rgba(0, 0, 0, 0.25)"
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
                                  </div>
                                  {/* <ButtonGroup className="w-100" size="sm"> */}
                                  <div className="w-100 d-flex">
                                    <ReportButton
                                      size="sm"
                                      variant={
                                        progress(item) >= 100
                                          ? "success"
                                          : "primary"
                                      }
                                      className="w-100 m-1"
                                      style={{
                                        position: "relative"
                                      }}
                                      project={project}
                                      description={description}
                                      item={item}
                                      disabled={
                                        !["Coated Item", "Mould"].includes(
                                          description.data.geometry
                                        )
                                      }
                                    >
                                      <FontAwesomeIcon
                                        icon={["fas", "file-download"]}
                                        className="mr-2"
                                      ></FontAwesomeIcon>
                                      Report
                                    </ReportButton>
                                    {/* <Button
                                      size="sm"
                                      variant="danger"
                                      className="m-1"
                                      style={{
                                        position: "relative"
                                      }}
                                      disabled
                                    >
                                      <FontAwesomeIcon
                                        icon={["fas", "trash-alt"]}
                                      ></FontAwesomeIcon>
                                    </Button> */}
                                    {/* </ButtonGroup> */}
                                  </div>
                                </div>
                              </Col>
                            );
                          })}
                      </ItemGrid>
                    </Tree>
                  );
                })}
            </Tree>
          );
        })
      ) : (
        <NoItemsFound show={showNoItemsFound} />
      )}
    </div>
  );
};
