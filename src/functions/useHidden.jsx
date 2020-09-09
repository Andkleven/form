import { useEffect, useCallback, useState, useContext } from "react";
import objectPath from "object-path";
import { DocumentDataContext } from "components/form/Form";
export default (readOnlyFieldIf, keyName) => {
  const { documentData, renderFunction } = useContext(DocumentDataContext);
  const [hidden, setHidden] = useState(false);

  const updateReadOnly = useCallback(() => {
    if (
      typeof readOnlyFieldIf === "object" &&
      readOnlyFieldIf !== null &&
      !(readOnlyFieldIf instanceof Array)
    ) {
      let key = Object.keys(readOnlyFieldIf)[0];
      let value = objectPath.get(documentData.current, key, undefined);
      setHidden(
        value === undefined ? true : !readOnlyFieldIf[key].includes(value)
      );
    } else {
      setHidden(!objectPath.get(documentData.current, readOnlyFieldIf, false));
    }
  }, [setHidden, readOnlyFieldIf, documentData]);

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
