import React, { useContext, useEffect, useRef } from "react";
import { DocumentDateContext } from "components/form/Form";
import Math from "components/form/functions/math";
import ReadField from "components/form/components/fields/ReadField";

import "styles/styles.css";

export default props => {
  const newValue = useRef("")
  const {documentDate, documentDateDispatch} = useContext(DocumentDateContext);
    // Test if value shall update when documentDate update
    useEffect(() => {
      const getValueFromMath = props.setValueByIndex
                ? props.repeatStep + 1
                : Math[props.math](
                  documentDate,
                  props.repeatStepList,
                  props.decimal ? props.decimal : 0)
      if (newValue.current !== getValueFromMath) {
        documentDateDispatch({type: 'add', newState: getValueFromMath, path: props.path})
        newValue.current = getValueFromMath
      }
  }, [
    documentDateDispatch,
    props.path,
    props.setValueByIndex,
    props.repeatStep,
    props.math,
    props.decimal,
    documentDate,
    props.repeatStepList
  ]);

  return (
    <ReadField
      {...props}
      key={props.indexId}
      // error={error}
      readOnly={true}
      value={props.setValueByIndex
        ? props.repeatStep + 1
        : Math[props.math](
          documentDate,
          props.repeatStepList,
          props.decimal ? props.decimal : 0)}
      // showMinMax={temporaryValue !== null ? true : false}
    />
  );
};
