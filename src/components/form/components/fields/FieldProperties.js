import React, { useContext, useCallback, useEffect, useMemo, useState } from "react";
import ReadField from "./ReadField";
import ReadOnlyField from "components/form/components/fields/ReadOnlyField";
import Input from "components/input/Input";
import WriteField from "components/form/components/fields/WriteField";
import objectPath from "object-path";
import { DocumentDateContext, ChapterContext } from "components/form/Form";

import {
  getSubtext,
  findValue,
  calculateMaxMin,
  variableLabel
} from "functions/general";
import Subtitle from "components/design/fonts/Subtitle";

export default ({resetState, ...props}) => {
  const { documentDate, func } = useContext(
    DocumentDateContext
  );
  const { editChapter } = useContext(ChapterContext);

  const [state, setState] = useState("")
  const [label, setLabel] = useState("")

  
  const getNewPath = useCallback(() => {
    if (props.type === "file") {
      return `${props.path}.${props.fieldName}`;
    }
    return `${props.path ? props.path + ".data." : ""}${props.fieldName}`;
  }, [props.path, props.fieldName, props.type]);
  

  useEffect(() => {
    setState(objectPath.get(Object.keys(documentDate).length === 0 ? props.backendData : documentDate, getNewPath(), null))
  }, [resetState, props.backendData, setState, getNewPath, documentDate])


  // useEffect(() => {
  //   let saveState = objectPath.get(props.backendData, getNewPath(), null);
  //   if (saveState === null && !props.specValueList) {
  //     let newState;
  //     if (["date", "datetime-local"].includes(props.type)) {
  //       newState = emptyField(saveState) ? null : new Date(saveState);
  //     } else {
  //       newState =
  //         props.default !== undefined
  //           ? props.default
  //           : ["checkbox", "radio", "switch"].includes(props.type)
  //           ? false
  //           : props.default === "select"
  //           ? props.options[0]
  //           : "";
  //     }
  //     setState(objectPath.get(props.backendData, getNewPath(), null))
  //     documentDateDispatch({ type: "add", newState, path: getNewPath() });
  //   }
  // }, [
  //   props.specValueList,
  //   documentDateDispatch,
  //   props.default,
  //   props.type,
  //   props.options,
  //   props.fieldName,
  //   getNewPath,
  //   props.backendData,
  //   setState
  // ]);

  const { min, max } = useMemo(() => (calculateMaxMin(
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
  )), [
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
  ]);

  const subtext = useMemo(() => (getSubtext(
    props.subtext,
    findValue(
      props.specData,
      props.specSubtextList,
      props.repeatStepList,
      props.editRepeatStepSubtextList
    ),
    props.max,
    props.min,
    props.maxInput,
    props.minInput,
    props.unit,
    props.required,
    props.subtextMathMin,
    props.subtextMathMax,
    props.repeatStepList,
    props.allData
  )),[
    props.max,
    props.min,
    props.maxInput,
    props.minInput,
    props.unit,
    props.required,
    props.subtextMathMin,
    props.subtextMathMax,
    props.repeatStepList,
    props.allData,
    props.specData,
    props.specSubtextList,
    props.editRepeatStepSubtextList,
    props.subtext
  ]);

  const getLabel = useCallback((data=documentDate) => {
    setLabel(variableLabel(
      props.label,
      props.variableLabelSpec ? props.specData : data,
      props.queryVariableLabel,
      props.repeatStepList,
      props.editRepeatStepListVariableLabel,
      props.indexVariableLabel ? props.repeatStep : undefined
    ))
  }, [
    props.label,
    props.variableLabelSpec,
    props.specData,
    props.queryVariableLabel,
    props.repeatStepList,
    props.editRepeatStepListVariableLabel,
    props.indexVariableLabel,
    props.repeatStep,
    documentDate
  ])

  useEffect(() => {
    if (props.queryVariableLabel || props.indexVariableLabel) {
      func[`${props.label}-${props.repeatStepList}-FieldProperties`] = getLabel;
    } else {
      setLabel(props.label)
    }
    return () => {
      if (props.queryVariableLabel || props.indexVariableLabel) {
        delete func[`${props.label}-${props.repeatStepList}-FieldProperties`]
      }
    }
  },[
    props.queryVariableLabel, 
    props.indexVariableLabel, 
    setLabel, 
    props.label, 
    getLabel, 
    func,
    props.repeatStepList
  ])

  useEffect(() => {
    getLabel(props.backendData)
  }, [props.backendData, getLabel])

  
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
      } else if (props.math || props.setValueByIndex) {
        const commonProps = {
          ...props,
          key: `${props.indexId}-${props.index}`,
          path: getNewPath(),
          submitButton:
            `${props.repeatStepList}-${props.fieldName}` === editChapter
              ? true
              : false,
          min: min,
          max: max,
          label: label,
          subtext: subtext,
          file: props.type === "file" ? props.file : null,
          indexId: `${props.indexId}-${props.index}`,
          index: props.index,
          resetState: resetState
        };
        if (props.math) {
          return (
            <small>
              <ReadOnlyField
                {...commonProps}
                noLine
                className="mt-n3 mb-3 pt-1"
              />
            </small>
          );
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
