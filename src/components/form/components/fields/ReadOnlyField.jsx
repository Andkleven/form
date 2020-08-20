import React, { useContext, useEffect, useCallback, useState } from "react";
import { documentDataContext } from "components/form/Form";
import Math from "components/form/functions/math";
import ReadField from "components/form/components/fields/ReadField";

import "styles/styles.css";

export default ({ backendData, ...props }) => {
  const [value, setValue] = useState("");
  const { documentData, renderFunction, stateDispatch, mathStore } = useContext(documentDataContext);
  const math = useCallback(() => {
    const getValueFromMath = Math[props.math](
      Object.keys(documentData.current).length === 0
        ? backendData
        : documentData.current,
      mathStore.current,
      props.repeatStepList,
      props.decimal ? props.decimal : 0
    );
    stateDispatch({ path: props.path, newState: getValueFromMath })
    setValue(getValueFromMath);
  }, [
    documentData,
    props.decimal,
    props.math,
    backendData,
    props.repeatStepList,
    stateDispatch,
    props.path,
    mathStore
  ]);

  useEffect(() => {


    renderFunction.current[
      `${props.label}-${props.fieldName}-${props.repeatStepList}-ReadOnly`
    ] = math;
    return () => {
      delete renderFunction.current[
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
    <ReadField
      {...props}
      key={`${props.indexId}-${props.index}-readField-readOnly`}
      backendData={props.backendData}
      readOnly={true}
      value={value}
    />
  );
};
