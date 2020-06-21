import React, { useContext, useEffect, useCallback, useState } from "react";
import { DocumentDateContext } from "components/form/Form";
import Math from "components/form/functions/math";
import ReadField from "components/form/components/fields/ReadField";

import "styles/styles.css";

export default ({ resetState, backendData, ...props }) => {
  const [value, setValue] = useState("");
  const { documentDate, renderFunction } = useContext(DocumentDateContext);
  const math = useCallback(() => {
    const getValueFromMath = Math[props.math](
      Object.keys(documentDate.current).length === 0
        ? backendData
        : documentDate.current,
      props.repeatStepList,
      props.decimal ? props.decimal : 0
    );
    setValue(getValueFromMath);
  }, [
    documentDate,
    props.decimal,
    props.math,
    backendData,
    props.repeatStepList
  ]);

  useEffect(() => {
    let effectsRenderFunction = renderFunction.current;
    effectsRenderFunction[
      `${props.label}-${props.fieldName}-${props.repeatStepList}-ReadOnly`
    ] = math;
    return () => {
      delete effectsRenderFunction[
        `${props.label}-${props.fieldName}-${props.repeatStepList}-ReadOnly`
      ];
    };
  }, [
    math,
    renderFunction,
    props.label,
    props.repeatStepList,
    props.fieldName
  ]);

  useEffect(() => {
    math();
  }, [math]);

  return (
    <ReadField {...props} key={props.indexId} readOnly={true} value={value} />
  );
};
