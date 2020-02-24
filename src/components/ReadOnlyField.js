import React, { useContext, useEffect, useState } from "react";
import { DocumentDateContext } from "./DocumentAndSubmit";
import Math from "./Math";
import ReadField from "./ReadField";

import "../styles/styles.css";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  const [value, setValue] = useState("");
  const [showMinMax, setShowMinMax] = useState(false);

  useEffect(() => {
    let temporaryValue = props.setValueByIndex
      ? props.listIndex + 1
      : props.math
      ? Math[props.math](
          documentDateContext.documentDate,
          props.listIndex,
          props.decimal ? props.decimal : 0
        )
      : props.state[props.fieldName];
    if (temporaryValue !== null && !showMinMax) {
      setShowMinMax(true);
    }
    if (temporaryValue !== props.state[props.fieldName]) {
      setValue(temporaryValue);
      props.setState(prevState => ({
        ...prevState,
        [props.fieldName]: temporaryValue
      }));
    }
  }, [documentDateContext.documentDate]);
  return (
    <>
      <ReadField
        {...props}
        key={props.indexId}
        value={value}
        showMinMax={showMinMax}
      />
    </>
  );
};
