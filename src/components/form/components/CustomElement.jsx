import React, { useContext, useState, useEffect, useCallback } from "react";
import ReadField from "components/form/components/fields/ReadField";
import objectPath from "object-path";
import { sumFieldInObject, writeOrReadChapter } from "functions/general";
import { documentDataContext, ChapterContext } from "components/form/Form";
import { Alert } from "react-bootstrap";
import Line from "components/design/Line";
import math from "components/form/functions/math"

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
    <div>
      <b>
        <Line></Line>
        <ReadField
          textCenter={true}
          readOnly={true}
          backendData={props.backendData}
          label={"Step"}
          value={`${props.repeatStepList[0] + 1} of ${
            objectPath.get(props.specData, "leadEngineers.0.vulcanizationSteps")
              .length
            }`}
        />
      </b>
      <b>
        <ReadField
          textCenter={true}
          readOnly={true}
          backendData={props.backendData}
          noLine
          label={"Layer"}
          value={`${layers} of ${sumFieldInObject(
            objectPath.get(
              props.specData,
              "leadEngineers.0.vulcanizationSteps"
            ),
            "numberOfLayers"
          )}`}
        />
        <Line></Line>
      </b>
    </div>
  );
};

const CustomLead = props => {
  const { documentData, renderFunction } = useContext(documentDataContext);
  const {
    finalChapter,
    editChapter
  } = useContext(ChapterContext);
  const [status, setStatus] = useState("danger");
  const [toleranceMin, setToleranceMin] = useState(0);
  const [toleranceMax, setToleranceMax] = useState(0);
  const [layersThickness, setLayersThickness] = useState(0);

  const thickness = useCallback(() => {
    let toleranceMinTemporary = math["mathToleranceMin"](documentData.current, props.repeatStepList, 0)
    let toleranceMaxTemporary = math["mathToleranceMax"](documentData.current, props.repeatStepList, 0)

    let layersThicknessTemporary = 0.0;
    let steps = objectPath.get(documentData.current, "leadEngineers.0.vulcanizationSteps");
    if (Array.isArray(steps)) {
      steps.forEach((step, stepIndex) => {
        step.coatingLayers &&
          step.coatingLayers.forEach((coatingLayer, coatingLayerIndex) => {
            layersThicknessTemporary += Number(math["mathShrinkThickness"](documentData.current, [stepIndex, coatingLayerIndex], 1))
          });
      });
    }
    layersThicknessTemporary = layersThicknessTemporary * 2.0;
    setStatus(() =>
      toleranceMinTemporary <= layersThicknessTemporary &&
        layersThicknessTemporary <= toleranceMaxTemporary
        ? "success"
        : "warning"
    );
    setToleranceMin(toleranceMinTemporary);
    setToleranceMax(toleranceMaxTemporary);
    setLayersThickness(layersThicknessTemporary);
  },
    [
      documentData,
      setStatus,
      setToleranceMin,
      setToleranceMax,
      setLayersThickness,
      props.repeatStepList
    ]
  );

  useEffect(() => {

    renderFunction.current[`${props.repeatStepList}-CustomLead`] = thickness;
    return () => {
      delete renderFunction.current[`${props.repeatStepList}-CustomLead`];
    };
  }, [thickness, props.repeatStepList, renderFunction]);


  if (
    writeOrReadChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter) &&
    toleranceMin &&
    toleranceMax &&
    layersThickness
  ) {
    return (
      <div>
        <Alert variant={status} className="">
          <Alert.Heading>
            {status === "warning" && "Uh-oh 😨"}
            {status === "success" && "Nice 😄"}
          </Alert.Heading>
          <div>
            Tolerated total rubber thickness is between <b>{toleranceMin}</b> and{" "}
            <b>{toleranceMax}</b>, and the sum of all layer thicknesses is{" "}
            <b>{layersThickness.toFixed(1)}</b>.
        </div>
        </Alert>
      </div>
    );
  } else {
    return null;
  }
};

const ActualSteelThickness = props => {
  if (props.repeatStepList[1] === 0) {
    return objectPath
      .get(props.backendData, `operators.0.measurementPointActualTdvs`)
      .map((measurementPointActual, index) => {
        return (
          <ReadField
            key={`${index}-ActualSteelThickness`}
            backendData={props.backendData}
            readOnly={true}
            label={`Measurement Point Actual Steel ${objectPath.get(
              props.specData,
              `leadEngineers.0.data.targetDescriptionValue`
            )}`}
            value={measurementPointActual.data.measurementPointActual}
          />
        );
      });
  }
  return null;
};

const CustomComponents = {
  CustomCoating,
  CustomLead,
  ActualSteelThickness
};

export default CustomComponents;
