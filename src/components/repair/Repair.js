import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import Button from "react-bootstrap/Button";
import mutation  from "graphql/mutation.js";

let repairStages = [
    "steelPreparation1",
    "steelPreparation2",
    "primer1",
    "coatingStep",
    "touchUp",
    "qualityControl"
]


export default props => {
    const handleClick = (e, stage) => {
        e.preventDefault();
        mutationHandle({
          variables: {
            id: props.id,
            stage,
            repair: true
          }
        });
      };
    

  const [mutationHandle, { loading, error }] = useMutation(
    mutation["ITEM"]
  );
  const stageButtons = repairStages.forEach((stage) => (
    <Button type="button" onClick={(e) => handleClick(e, stage)}>
      {stage}
    </Button>
  ))

  return (
    <>
    {stageButtons}
    {loading && <p> Loading... </p>}
    {error && <p> Error Please try again</p>}
    </>
  );
};