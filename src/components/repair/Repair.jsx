import React from "react";
import { useMutation } from "@apollo/react-hooks";
import Button from "react-bootstrap/Button";
import mutation from "graphql/mutation.js";

const repairStages = [
  "steelPreparation1",
  "steelPreparation2",
  "primer1",
  "coatingStep",
  "touchUp",
  "qualityControl"
];

export default ({ id }) => {
  const handleClick = (e, repairStage) => {
    e.preventDefault();
    mutationHandle({
      variables: {
        id: id,
        stage: repairStage,
        repair: true
      }
    });
  };

  const [mutationHandle, { loading, error }] = useMutation(mutation["ITEM"]);
  const stageButtons = repairStages.forEach(repairStage => (
    <Button type="button" onClick={e => handleClick(e, repairStage)}>
      {repairStage}
    </Button>
  ));

  return (
    <>
      {stageButtons}
      {loading && <p> Loading... </p>}
      {error && <p> Error Please try again</p>}
    </>
  );
};
