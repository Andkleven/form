import React from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import mutation from "graphql/mutation.js";
import { Modal } from "react-bootstrap";
import DepthButtonGroup from "components/button/DepthButtonGroup";
import DepthButton from "components/button/DepthButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { camelCaseToNormal, objectifyQuery } from "functions/general";
import Loading from "components/Loading";
import stages from "components/form/stage/stages.json";
import objectPath from "object-path";
import { useParams } from "react-router-dom";
import gql from "graphql-tag";

// const repairStages = [
//   { stage: "steelPreparation1", label: "Steel Preparation 1" },
//   { stage: "steelPreparation2", label: "Steel Preparation 2" },
//   { stage: "primer1", label: "Primer" },
//   { stage: "coatingStep", label: "Coating" },
//   { stage: "touchUp", label: "Touch Up" },
//   { stage: "qualityControlCoatedItem", label: "Quality Control" }
// ];

function itemHasStage(leadData, stage, packerOrCoating) {
  if (!!stages[packerOrCoating][stage]) {
    return !!objectPath.get(
      leadData,
      stages[packerOrCoating][stage].queryPath,
      false
    );
  }
  return false;
}

const queries = {
  item: gql`
    query($id: Int) {
      items(id: $id) {
        id
        leadEngineer {
          id
          data
        }
      }
    }
  `
};

export default ({ id, show, setShow, children }) => {
  const params = useParams();

  const itemQuery = useQuery(queries.item, {
    variables: {
      id: params.itemId
    }
  });

  console.log(objectifyQuery(itemQuery.data));

  const itemData = objectifyQuery(itemQuery.data);
  const leadData = itemData && objectifyQuery(itemData).items[0].leadEngineer;
  const packerOrCoating = "coating";

  const repairStages = [];

  stages.all.forEach(stage => {
    if (
      leadData &&
      stage &&
      packerOrCoating &&
      itemHasStage(leadData, stage, packerOrCoating)
    ) {
      repairStages.push({
        stage,
        label: stages[packerOrCoating][stage].label || camelCaseToNormal(stage)
      });
    }
  });

  const handleClick = (e, repairStage) => {
    e.preventDefault();
    mutationHandle({
      variables: {
        id: id,
        stage: repairStage,
        repair: true,
        deleteSeen: true
      }
    });
  };

  const [mutationHandle, { loading, error }] = useMutation(mutation["ITEM"]);
  const stageButtons = repairStages.map((repairStage, index) => (
    <DepthButton
      key={`repair-${repairStage.stage}-button`}
      className={`w-100 ${index + 1 !== repairStages.length && "mb-1"}`}
      type="button"
      disabled={!id}
      onClick={e => handleClick(e, repairStage.stage)}
    >
      {camelCaseToNormal(repairStage.label)}
    </DepthButton>
  ));

  const handleClose = () => setShow(false);

  return (
    <>
      {children}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title>
            <FontAwesomeIcon icon={["fas", "tools"]} className="text-primary" />{" "}
            Send item for repair
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {stageButtons}
          {loading && <Loading />}
          {error && <div>Error Please try again</div>}
        </Modal.Body>
        <Modal.Footer>
          <DepthButtonGroup className="w-100">
            <DepthButton
              onClick={handleClose}
              // iconProps={{
              //   icon: ["fas", "times"],
              //   className: "text-secondary"
              // }}
            >
              Close
            </DepthButton>
          </DepthButtonGroup>
        </Modal.Footer>
      </Modal>
    </>
  );
};
