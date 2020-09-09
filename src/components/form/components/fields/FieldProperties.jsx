import React, {
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef
} from "react";
import ReadField from "./ReadField";
import ReadOnlyField from "components/form/components/fields/ReadOnlyField";
import WriteField from "components/form/components/fields/WriteField";
import objectPath from "object-path";
import { DocumentDataContext, ChapterContext } from "components/form/Form";
import Math from "components/form/functions/math";
import {
  getSubtext,
  findValue,
  calculateMaxMin,
  variableLabel,
  isNumber,
  writeChapter,
  getProperties
} from "functions/general";
import Subtitle from "components/design/fonts/Subtitle";
import Line from "components/design/Line";
import useHidden from "functions/useHidden";

export default React.memo(({ ...props }) => {
  const {
    documentData,
    renderFunction,
    documentDataDispatch,
    resetState
  } = useContext(DocumentDataContext);
  const { editChapter, finalChapter } = useContext(ChapterContext);

  const getNewPath = useCallback(() => {
    if (props.type === "file") {
      return `${props.path}.${props.fieldName}`;
    }
    return `${props.path ? props.path + ".data." : ""}${props.fieldName}`;
  }, [props.path, props.fieldName, props.type]);

  const [state, setState] = useState("");
  const hidden = useHidden(props.readOnlyFieldIf, [
    `${props.label}-${props.prepend}-${props.repeatStepList}-FieldProperties-hidden`
  ]);

  const [label, setLabel] = useState("");
  const setFirstValue = useRef(true);
  const unit = useRef(getProperties(props.unit, props.jsonVariables));

  const updateState = useCallback(() => {
    let documentDataState = objectPath.get(
      documentData.current,
      getNewPath(),
      props.type === "checkbox" ? false : ""
    );
    if (props.type === "date" || props.type === "datetime-local") {
      documentDataState = documentDataState
        ? new Date(documentDataState)
        : undefined;
    }
    if (props.path && props.fieldName && documentDataState !== state) {
      setState(documentDataState);
      documentDataDispatch({
        type: "add",
        newState: documentDataState,
        path: getNewPath(),
        notReRender: true
      });
    }
  }, [
    props.path,
    props.fieldName,
    documentData,
    state,
    getNewPath,
    documentDataDispatch,
    props.type
  ]);
  useEffect(() => {
    if (
      !hidden &&
      writeChapter(
        props.allWaysShow,
        editChapter,
        props.thisChapter,
        finalChapter.current
      )
    ) {
      resetState.current[
        `${props.path}-${props.label}-${props.prepend}-${props.repeatStepList}-FieldProperties-resetState`
      ] = updateState;
    }
    return () => {
      if (
        resetState.current[
          `${props.path}-${props.label}-${props.prepend}-${props.repeatStepList}-FieldProperties-resetState`
        ]
      ) {
        // eslint-disable-next-line
        delete resetState.current[
          `${props.path}-${props.label}-${props.prepend}-${props.repeatStepList}-FieldProperties-resetState`
        ];
      }
    };
  }, [
    updateState,
    props.label,
    props.path,
    props.repeatStepList,
    props.allWaysShow,
    editChapter,
    props.thisChapter,
    finalChapter,
    hidden,
    resetState,
    props.prepend
  ]);

  useEffect(() => {
    if (props.path && props.fieldName) {
      let backendDate = objectPath.get(
        props.backendData,
        getNewPath(),
        getProperties(props.default, props.jsonVariables)
      );
      if (setFirstValue.current) {
        if (props.type === "date" || props.type === "datetime-local") {
          backendDate = backendDate ? new Date(backendDate) : undefined;
        }
        setState(backendDate);
        documentDataDispatch({
          type: "add",
          newState: backendDate,
          path: getNewPath(),
          notReRender: true
        });
        setFirstValue.current = false;
      }
    }
  }, [
    props.fieldName,
    documentDataDispatch,
    props.path,
    props.backendData,
    setState,
    getNewPath,
    documentData,
    props.type,
    props.default,
    props.jsonVariables
  ]);

  const { min, max } = useMemo(
    () =>
      calculateMaxMin(
        getProperties(props.min, props.jsonVariables),
        props.routeToSpecMin,
        props.editRepeatStepListMin,
        getProperties(props.calculateMin, props.jsonVariables),
        getProperties(props.max, props.jsonVariables),
        props.routeToSpecMax,
        props.editRepeatStepListMax,
        getProperties(props.calculateMax, props.jsonVariables),
        props.repeatStepList,
        props.specData,
        props.allData
      ),
    [
      props.jsonVariables,
      props.min,
      props.routeToSpecMin,
      props.editRepeatStepListMin,
      props.calculateMin,
      props.max,
      props.routeToSpecMax,
      props.editRepeatStepListMax,
      props.calculateMax,
      props.repeatStepList,
      props.specData,
      props.allData
    ]
  );

  const subtext = useMemo(
    () =>
      getSubtext(
        getProperties(props.subtext, props.jsonVariables),
        props.specSubtextList
          ? findValue(
              props.specData,
              props.specSubtextList,
              props.repeatStepList,
              props.editRepeatStepSubtextList
            )
          : props.mathSubtext
          ? Math[props.mathSubtext](
              props.specData,
              props.repeatStepList,
              props.decimal ? props.decimal : 0
            )
          : null,
        isNumber(props.maxInput) ? props.maxInput : max,
        isNumber(props.minInput) ? props.minInput : min,
        unit.current,
        props.subtextMathMin,
        props.subtextMathMax,
        props.repeatStepList,
        props.allData
      ),
    [
      props.jsonVariables,
      props.maxInput,
      props.minInput,
      max,
      min,
      props.mathSubtext,
      unit,
      props.subtextMathMin,
      props.subtextMathMax,
      props.repeatStepList,
      props.allData,
      props.specData,
      props.specSubtextList,
      props.editRepeatStepSubtextList,
      props.subtext,
      props.decimal
    ]
  );

  const getLabel = useCallback(
    (data = documentData.current) => {
      setLabel(
        variableLabel(
          getProperties(props.label, props.jsonVariables),
          getProperties(props.variableLabelSpec, props.jsonVariables)
            ? props.specData
            : data,
          getProperties(props.queryVariableLabel, props.jsonVariables),
          props.repeatStepList,
          props.editRepeatStepListVariableLabel,
          props.indexVariableLabel ? props.repeatStep : undefined
        )
      );
    },
    [
      props.jsonVariables,
      props.label,
      props.variableLabelSpec,
      props.specData,
      props.queryVariableLabel,
      props.repeatStepList,
      props.editRepeatStepListVariableLabel,
      props.indexVariableLabel,
      props.repeatStep,
      documentData
    ]
  );
  useEffect(() => {
    setLabel(props.label);
  }, [setLabel, props.label]);

  useEffect(() => {
    if (
      (getProperties(props.queryVariableLabel, props.jsonVariables) ||
        props.indexVariableLabel) &&
      writeChapter(
        props.allWaysShow,
        editChapter,
        props.thisChapter,
        finalChapter.current
      )
    ) {
      renderFunction.current[
        `${props.label}-${props.prepend}-${props.repeatStepList}-FieldProperties`
      ] = getLabel;
    }
    return () => {
      if (
        renderFunction.current[
          `${props.label}-${props.prepend}-${props.repeatStepList}-FieldProperties`
        ]
      ) {
        // eslint-disable-next-line
        delete renderFunction.current[
          `${props.label}-${props.prepend}-${props.repeatStepList}-FieldProperties`
        ];
      }
    };
  }, [
    props.jsonVariables,
    props.queryVariableLabel,
    props.indexVariableLabel,
    setLabel,
    props.prepend,
    props.label,
    getLabel,
    renderFunction,
    props.repeatStepList,
    props.allWaysShow,
    editChapter,
    props.thisChapter,
    finalChapter
  ]);

  useEffect(() => {
    getLabel(props.backendData);
  }, [props.backendData, getLabel]);

  if (props.specValueList) {
    return (
      <ReadField
        {...props}
        key={`${props.indexId}-${props.index}-readField`}
        readOnly={true}
        path={getNewPath()}
        subtext={subtext}
        unit={unit.current}
        value={findValue(
          props.specData,
          props.specValueList,
          props.repeatStepList,
          props.editRepeatStepValueList
        )}
        label={label}
      />
    );
  } else if (hidden) {
    return null;
  } else if (props.labelOnly) {
    return <span className={`text-secondary`}>{label}</span>;
  } else if (props.mathSpec) {
    return (
      <ReadField
        {...props}
        key={`${props.indexId}-${props.index}-readField-math`}
        readOnly={true}
        path={getNewPath()}
        subtext={subtext}
        unit={unit.current}
        value={Math[props.mathSpec](
          props.specData,
          props.repeatStepList,
          props.decimal ? props.decimal : 0
        )}
        label={label}
      />
    );
  } else if (props.math) {
    const commonProps = {
      ...props,
      key: `${props.indexId}-${props.index}`,
      unit: unit.current,
      path: getNewPath(),
      submitButton:
        `${props.repeatStepList}-${props.fieldName}` === editChapter
          ? true
          : false,
      label: label,
      subtext: subtext,
      file: props.type === "file" ? props.file : undefined,
      indexId: `${props.indexId}-${props.index}`,
      index: props.index
    };
    if (props.isSubtitle) {
      return (
        <>
          <div className={props.indent && `ml-3`}>
            <Subtitle small className="mt-3">{`${label} ${
              props.repeatStep + 1
            }`}</Subtitle>
            {/* Hidden ReadOnlyField */}
            {/* <ReadOnlyField {...commonProps} className="d-none" /> */}
          </div>
          <Line></Line>
        </>
      );
    } else if (props.size === "md") {
      if (
        writeChapter(
          props.allWaysShow,
          editChapter,
          props.thisChapter,
          finalChapter.current
        )
      ) {
        return <ReadOnlyField {...commonProps} noLine className={`mb-3`} />;
      } else {
        return <ReadOnlyField {...commonProps} />;
      }
    } else if ((!props.size && props.math) || props.size === "sm") {
      if (
        writeChapter(
          props.allWaysShow,
          editChapter,
          props.thisChapter,
          finalChapter.current
        )
      ) {
        return (
          <small>
            <ReadOnlyField
              {...commonProps}
              noLine
              className={`mt-n3 mb-3 pt-1`}
            />
          </small>
        );
      } else {
        return <ReadOnlyField {...commonProps} />;
      }
    } else {
      return <ReadOnlyField noLine {...commonProps} className={`mb-3`} />;
    }
  } else if (
    writeChapter(
      props.allWaysShow,
      editChapter,
      props.thisChapter,
      finalChapter.current
    ) ||
    `${props.repeatStepList}-${props.fieldName}` === editChapter
  ) {
    return (
      <WriteField
        {...props}
        key={`write-field-${props.indexId}-${props.index}-${props.fieldName}`}
        path={getNewPath()}
        unit={unit.current}
        submitButton={
          `${props.repeatStepList}-${props.fieldName}` === editChapter
            ? true
            : false
        }
        setState={setState}
        state={state}
        min={min}
        max={max}
        label={label}
        subtext={subtext}
        file={props.type === "file" ? props.file : undefined}
        indexId={`${props.indexId}-${props.index}`}
        index={props.index}
      />
    );
  } else {
    return (
      <ReadField
        {...props}
        key={`${props.indexId}-${props.index}-readField-other`}
        unit={unit.current}
        path={getNewPath()}
        indexId={`${props.indexId}-${props.index}`}
        index={props.index}
        value={state}
        subtext={subtext}
        label={label}
      />
    );
  }
});
