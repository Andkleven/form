import { useEffect, useCallback, useState, useContext } from "react";
import objectPath from "object-path";
import { DocumentDataContext } from "components/form/Form";
export default (backendData, readOnlyFieldIf, keyName) => {
  const { documentData, renderFunction } = useContext(DocumentDataContext);
  const [hidden, setHidden] = useState(
    readOnlyFieldIf
      ? !objectPath.get(documentData.current, readOnlyFieldIf, false)
      : false
  );
  const updateReadOnly = useCallback(() => {
    setHidden(
      !objectPath.get(
        Object.keys(documentData.current).length === 0
          ? backendData
          : documentData.current,
        readOnlyFieldIf,
        false
      )
    );
  }, [setHidden, backendData, readOnlyFieldIf, documentData]);

  useEffect(() => {
    if (readOnlyFieldIf) {
      renderFunction.current[keyName] = updateReadOnly;
    }
    return () => {
      if (renderFunction.current[keyName]) {
        // eslint-disable-next-line
        delete renderFunction.current[keyName];
      }
    };
  }, [readOnlyFieldIf, updateReadOnly, keyName, renderFunction]);

  useEffect(() => {
    if (readOnlyFieldIf) {
      updateReadOnly();
    }
  }, [readOnlyFieldIf, updateReadOnly]);
  return hidden;
};
