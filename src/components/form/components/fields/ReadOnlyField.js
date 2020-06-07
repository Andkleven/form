import React, { useContext, useEffect, useCallback, useState } from "react";
import { DocumentDateContext } from "components/form/Form";
import Math from "components/form/functions/math";
import ReadField from "components/form/components/fields/ReadField";
import objectPath from "object-path";

import "styles/styles.css";

export default ({resetState, backendData, ...props}) => {
  const [value, setValue] = useState("")
  const {documentDate, documentDateDispatch, func} = useContext(DocumentDateContext);
  
  const math = useCallback(
    () => {
      const getValueFromMath = props.setValueByIndex
                  ? props.repeatStep + 1
                  : Math[props.math](
                    documentDate,
                    props.repeatStepList,
                    props.decimal ? props.decimal : 0)
    documentDateDispatch({type: 'add', newState: getValueFromMath, path: props.path})
    setValue(getValueFromMath)
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
      func[`${props.label}-${props.repeatStepList}-ReadOnly`] = math
    return () => {
        delete func[`${props.label}-${props.repeatStepList}-ReadOnly`]
    }
  },[
    math,
    func,
    props.label,
    props.repeatStepList
  ])

  useEffect(() => {
    setValue(objectPath.get(Object.keys(documentDate).length === 0 ? backendData : documentDate, props.path, null))
  }, [resetState, setValue, props.path, backendData, documentDate])

  return (
    <ReadField
      {...props}
      key={props.indexId}
      readOnly={true}
      value={value}
    />
  );
};
