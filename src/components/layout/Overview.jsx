import React, { useState, useEffect } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import Form from "../form/Form";
import createProject from "templates/createProject";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query";
import { objectifyQuery } from "../functions/general";
import DepthButton from "../button/DepthButton";
import DepthButtonGroup from "../button/DepthButtonGroup";
import Line from "../design/Line";
import Math from "functions/math";
import gql from "graphql-tag";

const queries = {
  description: gql`
    query($id: Int) {
      descriptions(id: $id) {
        id
        data
        items {
          id
          itemId
          stage
        }
      }
    }
  `,
  item: gql`
    query($id: Int) {
      items(id: $id) {
        id
        itemId
        leadEngineer {
          id
          data
        }
      }
    }
  `
};
export default () => {
  const [show, setShow] = useState(false);

  const params = useParams();

  const id = params.projectId;

  const [fixedData, setFixedData] = useState("");

  const { loading, error, data } = useQuery(query[createProject.query], {
    variables: { id: id }
  });

  const descriptionQuery = useQuery(queries.description, {
    variables: {
      id: params.descriptionId
    }
  });

  const itemQuery = useQuery(queries.item, {
    variables: {
      id: params.itemId
    }
  });

  useEffect(() => {
    setFixedData(objectifyQuery(data));
  }, [id, loading, error, data]);

  const descriptionIndex =
    fixedData &&
    fixedData.projects &&
    fixedData.projects[0] &&
    fixedData.projects[0].descriptions.findIndex(
      e => String(e.id) === String(params.descriptionId)
    );

  const Items = () => {
    if (
      !(
        fixedData &&
        fixedData.projects &&
        fixedData.projects[0] &&
        fixedData.projects[0].descriptions
      )
    ) {
      return null;
    }

    if (params.unique === "0") {
      let items = [];

      fixedData.projects[0].descriptions[descriptionIndex].items.forEach(
        item => {
          item && !item.unique && items.push(item.itemId);
        }
      );

      if (items.length < 1) {
        return null;
      }

      let string = items.join(", ");

      return string;
    } else {
      const index = fixedData.projects[0].descriptions[
        descriptionIndex
      ].items.findIndex(item => String(item.id) === String(params.itemId));
      return fixedData.projects[0].descriptions[descriptionIndex].items[index]
        .itemId;
    }
  };
  const items = Items();
  return (
    <>
      <Container
        style={{ position: "fixed", zIndex: 1 }}
        className="w-100 d-flex justify-content-center"
      >
        <div
          style={{ height: 0, position: "relative", bottom: 0, zIndex: 1 }}
          className="w-100 mt-3 mt-sm-0"
        >
          <div
            className="d-flex justify-content-end"
            style={{ position: "relative", bottom: ".75em" }}
          >
            <Button
              variant="primary"
              onClick={() => {
                setShow(!show);
              }}
              className={`d-flex align-items-center justify-content-center shadow py-2 px-3`}
            >
              <FontAwesomeIcon icon={["fas", "info"]} size="sm" />
            </Button>
          </div>
        </div>
      </Container>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        size="xl"
        centered
        className="px-0 px-sm-3"
      >
        <Modal.Header>
          <Modal.Title className="d-flex align-items-center justify-content-between w-100">
            <div>
              <h2 className="py-0 my-0">Overview</h2>
            </div>
            <div>
              <DepthButtonGroup>
                <DepthButton onClick={() => setShow(false)} className="h-100">
                  <FontAwesomeIcon icon={["fal", "times"]} />
                </DepthButton>
              </DepthButtonGroup>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {items && items.length > 0 && (
            <div className="mb-5">
              <h3 style={{ position: "relative", top: ".1em" }}>
                {items.split(",")[1] ? "Items" : "Item"}
              </h3>
              <Line />
              {/* All */}
              {items}
              {/* Packer */}
              {descriptionQuery &&
                descriptionQuery.data &&
                ["Slip on 2", "Slip on 3", "B2P", "Dual"].includes(
                  JSON.parse(descriptionQuery.data.descriptions[0].data)
                    .geometry
                ) && (
                  <>
                    <div className="text-muted mb-n2">
                      <small>Item description:</small>
                    </div>
                    <div>
                      {(itemQuery &&
                        itemQuery.data &&
                        itemQuery.data.items[0].leadEngineer &&
                        Math["mathDescription"](
                          {
                            leadEngineer: {
                              data: JSON.parse(
                                itemQuery.data.items[0].leadEngineer.data
                              )
                            }
                          },
                          null,
                          0,
                          null,
                          [
                            JSON.parse(
                              descriptionQuery.data.descriptions[0].data
                            ).geometry
                          ]
                        )) ||
                        "N/A"}
                    </div>
                  </>
                )}
            </div>
          )}
          {fixedData && fixedData.projects && fixedData.projects[0] && (
            <Form
              componentsId={`overview${descriptionIndex}`}
              document={createProject}
              data={fixedData}
              repeatStepList={[descriptionIndex]}
              getQueryBy={id}
              optionsQuery={true}
              edit={false}
              readOnlySheet
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="w-100"
            variant="secondary"
            onClick={() => setShow(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
