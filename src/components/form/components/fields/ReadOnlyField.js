import React, { useContext, useEffect, useState } from "react";
import { DocumentDateContext } from "components/form/Form";
import Math from "components/form/functions/math";
import objectPath from "object-path";
import ReadField from "components/form/fields/ReadField";

import "styles/styles.css";

export default props => {
  const documentDateContext = useContext(DocumentDateContext);
  const [showMinMax, setShowMinMax] = useState(false); // if true show error message before submit
  // Test if value shall update when documentDate update
  useEffect(() => {
    let temporaryValue = props.setValueByIndex
      ? props.repeatStep + 1
      : props.math
      ? Math[props.math](
          documentDateContext.documentDate,
          props.repeatStepList,
          props.decimal ? props.decimal : 0
        )
      : props.state[props.fieldName];
    if (temporaryValue !== null && !showMinMax) {
      setShowMinMax(true);
    }
    if (
      objectPath.get(documentDateContext.documentDate, props.path) !==
      temporaryValue
    ) {
      documentDateContext.setDocumentDate(prevState => {
        objectPath.set(prevState, props.path, temporaryValue);
        return {
          ...prevState
        };
      });
    }
  }, [documentDateContext.documentDate]);
  return (
    <ReadField
      {...props}
      key={props.indexId}
      readOnly={true}
      value={objectPath.get(documentDateContext.documentDate, props.path)}
      showMinMax={showMinMax}
    />
  );
};
