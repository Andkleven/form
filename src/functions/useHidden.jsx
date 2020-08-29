import { useEffect, useCallback, useState, useContext } from "react";
import objectPath from "object-path";
import { documentDataContext } from "components/form/Form";
export default (backendData, readOnlyFieldIf, keyName) => {
  const { documentData, renderFunction } = useContext(documentDataContext);
  const [hidden, setHidden] = useState(false);

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
