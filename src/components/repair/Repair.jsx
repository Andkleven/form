import React from "react";
import { useMutation } from "@apollo/react-hooks";
import mutation from "graphql/mutation.js";
import { Modal } from "react-bootstrap";
import DepthButtonGroup from "components/button/DepthButtonGroup";
import DepthButton from "components/button/DepthButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { camelCaseToNormal } from "functions/general";
import Loading from "components/Loading";
import stages from "components/form/stage/stages.json";
import objectPath from "object-path";

const repairStages = [
  { stage: "steelPreparation1", label: "Steel Preparation 1" },
  { stage: "steelPreparation2", label: "Steel Preparation 2" },
  { stage: "primer1", label: "Primer" },
  { stage: "coatingStep", label: "Coating" },
  { stage: "touchUp", label: "Touch Up" },
  { stage: "qualityControlCoatedItem", label: "Quality Control" }
];

function hasItemStage(leadData, stage, packerOrCoating) {
  return !!objectPath.get(
    leadData,
    stages[packerOrCoating][stage]["queryPath"],
    false
  );
}

export default ({ id, show, setShow, children }) => {
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
