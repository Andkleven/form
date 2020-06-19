import React, {
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import ReadField from "./ReadField";
import ReadOnlyField from "components/form/components/fields/ReadOnlyField";
import Input from "components/input/Input";
import WriteField from "components/form/components/fields/WriteField";
import objectPath from "object-path";
import { DocumentDateContext, ChapterContext } from "components/form/Form";
import Math from "components/form/functions/math";
import {
  getSubtext,
  findValue,
  calculateMaxMin,
  variableLabel
} from "functions/general";
import Subtitle from "components/design/fonts/Subtitle";

export default ({ resetState, ...props }) => {
  const { documentDate, renderFunction } = useContext(DocumentDateContext);
  const { editChapter } = useContext(ChapterContext);

  const [state, setState] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const [label, setLabel] = useState("");
  const getNewPath = useCallback(() => {
    if (props.type === "file") {
      return `${props.path}.${props.fieldName}`;
    }
    return `${props.path ? props.path + ".data." : ""}${props.fieldName}`;
  }, [props.path, props.fieldName, props.type]);

  useEffect(() => {
    let backendDate = objectPath.get(
      Object.keys(documentDate.current).length === 0
        ? props.backendData
        : documentDate.current,
      getNewPath(),
      null
    );
    if (props.type === "date" || props.type === "datetime-local") {
      setState(backendDate ? new Date(backendDate) : null);
    } else {
      setState(backendDate);
    }
  }, [
    resetState,
    props.backendData,
    setState,
    getNewPath,
    documentDate,
    props.type
  ]);

  const updateReadOnly = useCallback(() => {
    setReadOnly(
      !objectPath.get(
        Object.keys(documentDate.current).length === 0
          ? props.backendData
          : documentDate.current,
        props.readOnlyFieldIf,
        false
      )
    );
  }, [setReadOnly, props.backendData, props.readOnlyFieldIf, documentDate]);

  useEffect(() => {
    let effectsRenderFunction = renderFunction.current;
    if (props.readOnlyFieldIf) {
      effectsRenderFunction[
        `${props.label}-${props.repeatStepList}-FieldProperties-ReadOnly`
      ] = updateReadOnly;
    }
    return () => {
      if (props.readOnlyFieldIf) {
        delete effectsRenderFunction[
          `${props.label}-${props.repeatStepList}-FieldProperties-ReadOnly`
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
        max,
        min,
        props.unit,
        props.subtextMathMin,
        props.subtextMathMax,
        props.repeatStepList,
        props.allData
      ),
    [
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
    (data = documentDate.current) => {
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
      documentDate
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
        key={`${props.indexId}-${props.index}`}
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
  } else if (props.mathSpec) {
    return (
      <ReadField
        {...props}
        key={`${props.indexId}-${props.index}`}
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
      resetState: resetState
    };
    if (props.math) {
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
      return (
        <>
          <Subtitle small>{`${label} ${props.repeatStep + 1}`}</Subtitle>
          {/* Hidden ReadOnlyField */}
          {/* <ReadOnlyField {...commonProps} className="d-none" /> */}
        </>
      );
    }
  } else if (
    props.writeChapter ||
    `${props.repeatStepList}-${props.fieldName}` === editChapter
  ) {
    return (
      <WriteField
        {...props}
        key={`${props.indexId}-${props.index}`}
        path={getNewPath()}
        submitButton={
          `${props.repeatStepList}-${props.fieldName}` === editChapter
            ? true
            : false
        }
        readOnly={readOnly}
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
  } else if (props.type === "file") {
    return (
      <Input
        {...props}
        key={`${props.indexId}-${props.index}`}
        subtext={subtext}
        singleFile={true}
        path={`${props.path}.${props.fieldName}`}
        label={label}
      />
    );
  } else {
    return (
      <ReadField
        {...props}
        key={`${props.indexId}-${props.index}`}
        readOnly={readOnly}
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
