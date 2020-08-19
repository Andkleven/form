import React, {
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import ReadField from "./ReadField";
import ReadOnlyField from "components/form/components/fields/ReadOnlyField";
import WriteField from "components/form/components/fields/WriteField";
import objectPath from "object-path";
import { documentDataContext, ChapterContext } from "components/form/Form";
import Math from "components/form/functions/math";
import {
  getSubtext,
  findValue,
  calculateMaxMin,
  variableLabel,
  isNumber
} from "functions/general";
import Subtitle from "components/design/fonts/Subtitle";
import Line from "components/design/Line";

export default ({ ...props }) => {
  const { documentData, renderFunction, documentDataDispatch, resetState } = useContext(documentDataContext);
  const { editChapter } = useContext(ChapterContext);

  const getNewPath = useCallback(() => {
    if (props.type === "file") {
      return `${props.path}.${props.fieldName}`;
    }
    return `${props.path ? props.path + ".data." : ""}${props.fieldName}`;
  }, [props.path, props.fieldName, props.type]);

  const [state, setState] = useState("");
  const [hidden, setHidden] = useState(false)
  const [label, setLabel] = useState("");

  const updateState = useCallback(
    () => {
      let documentDataState = objectPath.get(documentData.current,
        getNewPath(),
        null
      )
      if (props.path && props.fieldName && documentDataState !== null && documentDataState !== state) {
        setState(documentDataState)
      }
    },
    [props.path, props.fieldName, documentData, state, getNewPath]
  )

  useEffect(() => {
    let resetStateRef = resetState.current
    if (!hidden && props.writeChapter) {
      resetStateRef[
        `${props.path}-${props.label}-${props.repeatStepList}-FieldProperties-resetState`
      ] = updateState;
    }
    return () => {
      if (resetStateRef[
        `${props.path}-${props.label}-${props.repeatStepList}-FieldProperties-resetState`
      ]) {
        delete resetStateRef[
          `${props.path}-${props.label}-${props.repeatStepList}-FieldProperties-resetState`
        ];
      }
    }
  }, [updateState, props.label, props.path, props.repeatStepList, props.writeChapter, hidden, resetState])

  useEffect(() => {
    if (props.path && props.fieldName) {
      let backendDate = objectPath.get(
        Object.keys(documentData.current).length === 0
          ? props.backendData
          : documentData.current,
        getNewPath(),
        props.default === undefined ? "" : props.default
      );
      if (props.type === "date" || props.type === "datetime-local") {
        backendDate = backendDate ? new Date(backendDate) : null
      }
      setState(backendDate);
      documentDataDispatch({ type: "add", newState: backendDate, path: getNewPath() });

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
    props.default
  ]);

  const updateReadOnly = useCallback(() => {
    setHidden(
      !objectPath.get(
        Object.keys(documentData.current).length === 0
          ? props.backendData
          : documentData.current,
        props.readOnlyFieldIf,
        false
      )
    );
  }, [setHidden, props.backendData, props.readOnlyFieldIf, documentData]);

  useEffect(() => {
    let effectsRenderFunction = renderFunction.current;
    if (props.readOnlyFieldIf) {
      effectsRenderFunction[
        `${props.label}-${props.repeatStepList}-FieldProperties-hidden`
      ] = updateReadOnly;
    }
    return () => {
      if (props.readOnlyFieldIf) {
        delete effectsRenderFunction[
          `${props.label}-${props.repeatStepList}-FieldProperties-hidden`
        ];
      }
    };
  }, [
    props.readOnlyFieldIf,
    updateReadOnly,
    props.label,
    renderFunction,
    props.repeatStepList
  ]);

  useEffect(() => {
    if (props.readOnlyFieldIf) {
      updateReadOnly();
    }
  }, [props.readOnlyFieldIf, updateReadOnly]);

  const { min, max } = useMemo(
    () =>
      calculateMaxMin(
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
      ),
    [
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
        props.subtext,
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
        props.unit,
        props.subtextMathMin,
        props.subtextMathMax,
        props.repeatStepList,
        props.allData
      ),
    [
      props.maxInput,
      props.minInput,
      max,
      min,
      props.mathSubtext,
      props.unit,
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
          props.label,
          props.variableLabelSpec ? props.specData : data,
          props.queryVariableLabel,
          props.repeatStepList,
          props.editRepeatStepListVariableLabel,
          props.indexVariableLabel ? props.repeatStep : undefined
        )
      );
    },
    [
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
    let effectsRenderFunction = renderFunction.current;
    if (props.queryVariableLabel || props.indexVariableLabel) {
      effectsRenderFunction[
        `${props.label}-${props.repeatStepList}-FieldProperties`
      ] = getLabel;
    } else {
      setLabel(props.label);
    }
    return () => {
      if (props.queryVariableLabel || props.indexVariableLabel) {
        delete effectsRenderFunction[
          `${props.label}-${props.repeatStepList}-FieldProperties`
        ];
      }
    };
  }, [
    props.queryVariableLabel,
    props.indexVariableLabel,
    setLabel,
    props.label,
    getLabel,
    renderFunction,
    props.repeatStepList
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
    return null
  } else if (props.mathSpec) {
    return (
      <ReadField
        {...props}
        key={`${props.indexId}-${props.index}-readField-math`}
        readOnly={true}
        path={getNewPath()}
        subtext={subtext}
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
      path: getNewPath(),
      submitButton:
        `${props.repeatStepList}-${props.fieldName}` === editChapter
          ? true
          : false,
      label: label,
      subtext: subtext,
      file: props.type === "file" ? props.file : null,
      indexId: `${props.indexId}-${props.index}`,
      index: props.index,
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
      if (props.writeChapter) {
        return <ReadOnlyField {...commonProps} noLine className={`mb-3`} />;
      } else {
        return <ReadOnlyField {...commonProps} />;
      }
    } else if ((!props.size && props.math) || props.size === "sm") {
      if (props.writeChapter) {
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
    props.writeChapter ||
    `${props.repeatStepList}-${props.fieldName}` === editChapter
  ) {
    return (
      <WriteField
        {...props}
        key={`write-field-${props.indexId}-${props.index}-${props.fieldName}`}
        path={getNewPath()}
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
        file={props.type === "file" ? props.file : null}
        indexId={`${props.indexId}-${props.index}`}
        index={props.index}
      />
    );
  } else {
    return (
      <ReadField
        {...props}
        key={`${props.indexId}-${props.index}-readField-other`}
        path={getNewPath()}
        indexId={`${props.indexId}-${props.index}`}
        index={props.index}
        value={state}
        subtext={subtext}
        label={label}
      />
    );
  }
};
