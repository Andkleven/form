import React, { useContext, useState, useEffect, useCallback } from "react";
import ReadField from "components/form/components/fields/ReadField";
import objectPath from "object-path";
import { sumFieldInObject } from "functions/general";
import { DocumentDateContext } from "components/form/Form";


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


const CustomLead = props => {
  const { documentDate, renderFunction } = useContext(
    DocumentDateContext
  );
  const [style, setStyle] = useState({ fontSize: 20, color: "orange" });
  const [toleranceMin, setToleranceMin] = useState(0);
  const [toleranceMax, setToleranceMax] = useState(0);
  const [layersThickness, setLayersThickness] = useState(0);

  const thickness = useCallback(
    (data=documentDate) => {
      let toleranceMinTemporary = objectPath.get(data, "leadEngineers.0.data.toleranceMin", 0)
      let toleranceMaxTemporary = objectPath.get(data, "leadEngineers.0.data.toleranceMax", 0)
      let layersThicknessTemporary = 0
      let steps = objectPath.get(data, "leadEngineers.0.vulcanizationSteps")
      if (Array.isArray(steps)) {
        steps.forEach(step => {
          if (Array.isArray(step)) {
            step && step.coatingLayers.forEach(coatingLayer => {
              if (coatingLayer && coatingLayer.data.shrinkThickness) {
                layersThicknessTemporary += Number(coatingLayer.data.shrinkThickness)
              }
            })
          }
        })
      }
      layersThicknessTemporary = layersThicknessTemporary*2
      setStyle(prevState => ({
        ...prevState,
        color: (toleranceMinTemporary <= layersThicknessTemporary && layersThicknessTemporary <= toleranceMaxTemporary) ? "green" : "orange"
      }));
      if (toleranceMinTemporary !==  toleranceMin) {
        setToleranceMin(toleranceMinTemporary)
      }
      if (toleranceMaxTemporary !== toleranceMax) {
        setToleranceMax(toleranceMaxTemporary)
      }
      if (layersThicknessTemporary !== layersThickness) {
        setLayersThickness(layersThicknessTemporary)
      }
    },
    [
     documentDate,
     setStyle,
     setToleranceMin,
     setToleranceMax,
     setLayersThickness,
     toleranceMin,
     toleranceMax,
     layersThickness
    ])



  useEffect(() => {
    renderFunction[`${props.repeatStepList}-CustomLead`] = thickness;
    return () => {
      delete renderFunction[`${props.repeatStepList}-CustomLead`]
    }
  }, [thickness, props.repeatStepList, renderFunction]);

  useEffect(() => {
    thickness(props.backendData)
  }, [thickness, props.backendData])
  
  
  if (props.writeChapter && toleranceMin && toleranceMax && layersThickness) {
    return (
      <div style={style}>
        {`Ordered Total Rubber Thickness is between ${toleranceMin} and ${toleranceMax}`}
        <br/>
        {`Layers Thickness is ${layersThickness}`}
        </div>
  );
  } else {
    return null
  }
};

const CustomComponents = {
  CustomCoating,
  CustomLead
};

export default CustomComponents;
