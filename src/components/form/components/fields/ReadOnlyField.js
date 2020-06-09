import React, { useContext, useEffect, useCallback, useState } from "react";
import { DocumentDateContext } from "components/form/Form";
import Math from "components/form/functions/math";
import ReadField from "components/form/components/fields/ReadField";
import objectPath from "object-path";

import "styles/styles.css";

export default ({resetState, backendData, ...props}) => {
  const [value, setValue] = useState("")
  const {documentDate, documentDateDispatch, renderFunction} = useContext(DocumentDateContext);
  
  const math = useCallback(
    (data=documentDate, firstRender=false) => {
      const getValueFromMath = props.setValueByIndex
                  ? props.repeatStep + 1
                  : Math[props.math](
                    data,
                    props.repeatStepList,
                    props.decimal ? props.decimal : 0)
      if (objectPath.get(documentDate, props.path) !== getValueFromMath || firstRender) {
        documentDateDispatch({type: 'add', newState: getValueFromMath, path: props.path, notReRender: true})
        setValue(getValueFromMath)
      }
    },
    [
      props.setValueByIndex,
      documentDate, 
      documentDateDispatch, 
      props.decimal, 
      props.math, 
      props.path, 
      props.repeatStep, 
      props.repeatStepList
    ])

  useEffect(() => {
      renderFunction[`${props.label}-${props.repeatStepList}-ReadOnly`] = math
    return () => {
        delete renderFunction[`${props.label}-${props.repeatStepList}-ReadOnly`]
    }
  },[
    math,
    renderFunction,
    props.label,
    props.repeatStepList
  ])

  useEffect(() => {
    math(Object.keys(documentDate).length === 0 ? backendData : documentDate, true)
  }, [math, backendData, documentDate])

  return (
    <ReadField
      {...props}
      key={props.indexId}
      readOnly={true}
      value={value}
    />
  );
};
