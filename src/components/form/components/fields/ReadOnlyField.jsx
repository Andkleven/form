import React, { useContext, useEffect, useCallback, useState } from "react";
import { DocumentDataContext, ChapterContext } from "components/form/Form";
import Math from "components/form/functions/math";
import { writeChapter } from "functions/general"
import ReadField from "components/form/components/fields/ReadField";

import "styles/styles.css";


export default ({ backendData, ...props }) => {
  const [value, setValue] = useState("");
  const { editChapter, finalChapter } = useContext(ChapterContext);
  const { documentData, renderFunction, mathDispatch, mathStore, renderMath } = useContext(DocumentDataContext);
  const math = useCallback(() => {
    const getValueFromMath = Math[props.math](
      Object.keys(documentData.current).length === 0
        ? backendData
        : documentData.current,
      props.repeatStepList,
      props.decimal ? props.decimal : 0,
      mathStore.current
    );
    mathDispatch({ path: props.path, newState: getValueFromMath })
    setValue(getValueFromMath);
    Object.values(renderMath.current)
      .forEach(func => {
        func();
      });
  }, [
    documentData,
    props.decimal,
    props.math,
    backendData,
    props.repeatStepList,
    mathDispatch,
    props.path,
    renderMath,
    mathStore
  ]);

  useEffect(() => {
    if (writeChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter)) {
      renderFunction.current[
        `${props.label}-${props.fieldName}-${props.repeatStepList}-ReadOnly`
      ] = math;
    }

    return () => {
      if (renderFunction.current[`${props.label}-${props.fieldName}-${props.repeatStepList}-ReadOnly`]) {
        // eslint-disable-next-line
        delete renderFunction.current[
          `${props.label}-${props.fieldName}-${props.repeatStepList}-ReadOnly`
        ];
      }
    };
  }, [
    math,
    renderFunction,
    props.label,
    props.repeatStepList,
    props.fieldName,
    props.allWaysShow,
    props.thisChapter,
    editChapter,
    finalChapter
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
