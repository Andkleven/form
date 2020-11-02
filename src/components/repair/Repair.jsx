import React from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import mutation from "graphql/mutation.js";
import { Modal } from "react-bootstrap";
import DepthButtonGroup from "components/button/DepthButtonGroup";
import DepthButton from "components/button/DepthButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  camelCaseToNormal,
  objectifyQuery,
  // findValue,
  getProductionLine
} from "functions/general";
import Loading from "components/Loading";
import operatorJson from "templates/operator";
import qualityControlJson from "templates/qualityControl";
import stages from "components/form/stage/stages.json";
import findNextStage from "components/form/stage/findNextStage.ts";
// import objectPath from "object-path";
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

// function itemHasStage(leadData, stage, packerOrCoating) {
//   if (!!stages[packerOrCoating][stage]) {
//     let stageInfo = stages[packerOrCoating][stage];
//     if (stageInfo.queryPath === "") {
//       return true;
//     }
//     let repeatStepList = [];
//     if (stage.includes("Step")) {
//       let stepLayer = stage.split("Step")[1];
//       if (stage.includes("Layer")) {
//         repeatStepList.push(Number(stepLayer.split("Layer")[0]));
//         repeatStepList.push(Number(stepLayer.split("Layer")[1]));
//       } else {
//         repeatStepList.push(Number(stepLayer));
//       }
//     }
//     return !!findValue(
//       leadData,
//       stageInfo.queryPath,
//       repeatStepList,
//       stageInfo.editIndexList,
//       false
//     );
//   }
//   return false;
// }

const queries = {
  item: gql`
    query($id: Int) {
      items(id: $id) {
        id
        stage
        leadEngineer {
          id
          data
          measurementPointActualTdvs {
            id
            data
          }
          rubberCements {
            id
            data
          }
          ringMaterials {
            id
            data
          }
          additionalCustomTests {
            id
            data
          }
          finalInspectionCustomTests {
            id
            data
          }
          finalInspectionDimensionsChecks {
            id
            data
          }
          vulcanizationSteps {
            id
            data
            coatingLayers {
              id
              data
            }
          }
        }
        description {
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

  const itemData = objectifyQuery(itemQuery.data);
  const leadData = itemData && itemData.items[0];
  const geometry = itemData && itemData.items[0].description.data.geometry;
  let packerOrCoating = itemData && getProductionLine(geometry);
  const repairStages = [];
  let i = 0;
  let stage = "start";
  while (stage !== "done" && i < 50 && leadData) {
    stage = findNextStage(leadData, stage, geometry, {
      ...operatorJson.chapters,
      ...qualityControlJson.chapters
    }).stage;
    if (leadData.stage === stage) {
      break;
    }
    if (stage === "done") {
      break;
    }
    repairStages.push({
      stage,
      label:
        (stages[packerOrCoating][stage] &&
          stages[packerOrCoating][stage].label) ||
        camelCaseToNormal(stage)
    });
    i++;
  }

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
