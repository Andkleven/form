import { useEffect, useCallback, useState, useContext } from "react";
import objectPath from "object-path";
import { DocumentDataContext } from "components/form/Form";
export default (writeOnlyFieldIf, keyName) => {
  const { documentData, renderFunction } = useContext(DocumentDataContext);
  const [hidden, setHidden] = useState(false);

  const updateReadOnly = useCallback(() => {
    if (
      typeof writeOnlyFieldIf === "object" &&
      writeOnlyFieldIf !== null &&
      !(writeOnlyFieldIf instanceof Array)
    ) {
      let key = Object.keys(writeOnlyFieldIf)[0];
      let value = objectPath.get(documentData.current, key, undefined);
      setHidden(
        value === undefined ? true : !writeOnlyFieldIf[key].includes(value)
      );
    } else {
      setHidden(!objectPath.get(documentData.current, writeOnlyFieldIf, false));
    }
  }, [setHidden, writeOnlyFieldIf, documentData]);

  useEffect(() => {
    if (writeOnlyFieldIf) {
      renderFunction.current[keyName] = updateReadOnly;
    }
    return () => {
      if (renderFunction.current[keyName]) {
        // eslint-disable-next-line
        delete renderFunction.current[keyName];
      }
    };
  }, [writeOnlyFieldIf, updateReadOnly, keyName, renderFunction]);

  useEffect(() => {
    if (writeOnlyFieldIf) {
      updateReadOnly();
    }
  }, [writeOnlyFieldIf, updateReadOnly]);
  return hidden;
};
