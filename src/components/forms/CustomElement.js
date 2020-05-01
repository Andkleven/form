import React from "react";
import ReadField from "components/forms/fields/ReadField";
import objectPath from "object-path";
import { sumFieldInObject } from "functions/general";

const CustomCoating = props => {
  let layers = 0;
  for (let i = 0; i < props.arrayIndex[0]; i++) {
    layers += Number(
      objectPath.get(
        props.speckData,
        `leadEngineers.0.vulcanizationSteps.${i}.data.numberOfLayers`
      )
    );
  }
  layers += props.arrayIndex[1] + 1;

  return (
    <>
      <ReadField
        textCenter={true}
        readOnly={true}
        label={"Step"}
        value={`${props.arrayIndex[0] + 1} of ${
          objectPath.get(props.speckData, "leadEngineers.0.vulcanizationSteps")
            .length
        }`}
      />
      <ReadField
        textCenter={true}
        readOnly={true}
        label={"Layer"}
        value={`${layers} of ${sumFieldInObject(
          objectPath.get(props.speckData, "leadEngineers.0.vulcanizationSteps"),
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
