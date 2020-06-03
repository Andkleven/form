import React from "react";
import ReadField from "components/form/components/fields/ReadField";
import objectPath from "object-path";
import { sumFieldInObject } from "functions/general";

const CustomCoating = props => {
  let layers = 0;
  for (let i = 0; i < props.repeatStepList[0]; i++) {
    layers += Number(
      objectPath.get(
        props.specData,
        `leadEngineers.0.vulcanizationSteps.${i}.data.numberOfLayers`
      )
    );
  }
  layers += props.repeatStepList[1] + 1;

  return (
    <>
      <ReadField
        textCenter={true}
        readOnly={true}
        label={"Step"}
        value={`${props.repeatStepList[0] + 1} of ${
          objectPath.get(props.specData, "leadEngineers.0.vulcanizationSteps")
            .length
        }`}
      />
      <ReadField
        textCenter={true}
        readOnly={true}
        label={"Layer"}
        value={`${layers} of ${sumFieldInObject(
          objectPath.get(props.specData, "leadEngineers.0.vulcanizationSteps"),
          "numberOfLayers"
        )}`}
      />
    </>
  );
};

const CustomComponents = {
  CustomCoating
};
export default CustomComponents;
