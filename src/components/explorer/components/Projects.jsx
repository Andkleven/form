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
import LeadEngineerPage from "pages/leadEngineer/LeadEngineerPage";

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
  const user = getUser();
  const userIsAdmin = user.role === "ADMIN";
  const userIsQuality = user.role === "QUALITY";

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

  // Check for new items
  const newItem = (item, user) => {
    console.log(item.seen);
    return !(item.seen && !item.seen.includes(user.username));
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

  // Notification badge logic
  // _______________________________________________________________________

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

  const handleItemClick = id => {
    console.log(typeof id, typeof user.username);
    updateSeen({ variables: { id: parseInt(id), seen: [user.username] } });
  };
  // _______________________________________________________________________

  // Batching stages
  const batchingStages = Object.keys(batching);

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
        results.map((project, indexProject) => {
          return (
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
              badge={
                project.leadEngineerDone &&
                newInProject(project, user) && <Badge>New</Badge>
              }
            >
              <div className="d-flex align-items-center flex-wrap">
                {props.access && props.access.specs && (
                  <Link
                    to={`/project/${project["id"]}`}
                    key={`projectSpecs${indexProject}`}
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
                {!!stage &&
                  // Array of stages with batching here
                  batchingStages.includes(stage) && (
                    <>
                      <Link
                        // to={`/project/${project["id"]}`}
                        to={`/batching/${stage}/${project["id"]}`}
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
                      <Link
                        // to={`/project/${project["id"]}`}
                        to={`/partial-batching/${stage}/${project["id"]}`}
                        key={`projectPartialBatching${indexProject}`}
                        iconProps={{
                          icon: ["far", "cubes"],
                          size: iconSize,
                          style: iconStyle,
                          className: "text-secondary"
                        }}
                        style={{ marginRight: ".75em", ...rowStyle }}
                      >
                        Partial batching
                      </Link>
                    </>
                  )}
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
                                ` ∙ ${
                                  description.items.length
                                }/${numberOfChildren(
                                  data,
                                  project.data.projectName,
                                  description.data.description
                                )} Items`) ||
                              " ∙ No items"
                            }`}
                          </div>
                        </div>
                      }
                      badge={
                        newInDescription(description, user) && (
                          <Badge>New</Badge>
                        )
                      }
                    >
                      <ItemGrid className="mb-n3">
                        {props.access &&
                          (props.access.itemRead || props.access.itemWrite) &&
                          description.items &&
                          description.items.map((item, indexItem) => {
                            const stageIsQuality =
                              item.stage === "qualityControl";
                            const qcView =
                              (userIsQuality || userIsAdmin) && stageIsQuality;

                            let itemLink = `/404`;
                            itemLink = `/single-item/${item.id}/${description.data.geometry}`;

                            if (qcView) {
                              itemLink = `/quality-control/${item.id}/${description.data.geometry}`;
                            }

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
                                      onClick={() => handleItemClick(item.id)}
                                      to={itemLink}
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
                                            <div className="d-inline">
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
                                            progress(item) > 100
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
                                        progress(item) > 100
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
                                    >
                                      <FontAwesomeIcon
                                        icon={["fas", "file-download"]}
                                        className="mr-2"
                                      ></FontAwesomeIcon>
                                      Report
                                    </ReportButton>
                                    <Button
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
                                    </Button>
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
        <div className="pt-1 text-secondary">
          <em>No items found.</em>
        </div>
      )}
    </div>
  );
};
