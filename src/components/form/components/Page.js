import React, {
  useEffect,
  useContext,
  useState,
  useLayoutEffect,
  useMemo,
  useCallback
} from "react";
import SelectSetFieldGroupData from "components/form/components/fields/SelectSetFieldGroupData";
import SubmitButton from "components/button/SubmitButton";
import {
  ChapterContext,
  DocumentDateContext,
  FieldsContext,
} from "components/form/Form";
import { variableString, allTrue, getRepeatNumber } from "functions/general";
import Input from "components/input/Input";
import objectPath from "object-path";
import Title from "components/layout/design/fonts/Title";
import Subtitle from "components/layout/design/fonts/Subtitle";
import CustomComponents from "components/form/components/CustomElement";
import Line from "components/layout/design/Line";
import TabButton from "components/button/TabButton";

export default props => {
  const {setLastChapter, lastChapter, editChapter, setEditChapter} = useContext(ChapterContext);
  const {documentDateDispatch, documentDate} = useContext(DocumentDateContext);
  const {setIsSubmitted, isSubmitted ,setValidationPassed, validationPassed} = useContext(FieldsContext);
  const [writeChapter, setWriteChapter] = useState();
  useLayoutEffect(() => {

    if (props.lastChapter && props.lastChapter !== lastChapter) {
      setLastChapter(props.lastChapter);
    }
  }, [props.lastChapter, setLastChapter, lastChapter]);

  const addData = useCallback(pushOnIndex => {
    documentDateDispatch({type: 'add', newState: {},
                          fieldName: 'data',  path: `${props.path}.${pushOnIndex}`})
  },[props.path, documentDateDispatch]);

  const addHandler = () => {
    addData(
      objectPath.get(documentDate, props.path).length
    );
  };
  const deleteHandler = useCallback(index => {
    documentDateDispatch({type: 'delete', path: `${props.path}.${index}`})
  }, [props.path, documentDateDispatch]);

  // set repeatGroup
  useEffect(() => {

    if (props.allWaysShow) {
      setWriteChapter(true);
    } else if (editChapter) {
      if (props.thisChapter === editChapter) {
        setWriteChapter(true);
      } else {
        setWriteChapter(false);
      }
    } else if (props.thisChapter === lastChapter) {
      setWriteChapter(true);
    } else {
      setWriteChapter(false);
    }
  }, [
    props.allWaysShow,
    editChapter,
    props.thisChapter,
    lastChapter
  ]);

  // If repeat group start with one group set repeatGroup to 1
  // useEffect(() => {
    if (
      props.repeatStartWithOneGroup &&
      writeChapter &&
      (!objectPath.get(props.data, props.path) || objectPath.get(props.data, props.path).length === 0) &&
      Array.isArray(
        objectPath.get(documentDate, props.path)
      ) &&
      objectPath.get(documentDate, props.path).length === 0
    ) {
      addData(0);
    }
  // }, [
  //   // documentDate,
  //   props.repeatStartWithOneGroup,
  //   writeChapter,
  //   props.data,
  //   editChapter,
  //   lastChapter,
  //   props.path,
  //   addData
  // ]);

  // If number of repeat group decides by a another field, it's sets repeatGroup
  useEffect(() => {
    if (
      props.repeatGroupWithQuery &&
      !props.repeatGroupWithQuerySpecData
      // &&
      // objectPath.get(documentDateContext.documentDate, props.path)
    ) {
      let newValue = getRepeatNumber(
        documentDate,
        props.repeatGroupWithQuery,
        props.repeatStepList,
        props.editRepeatStepListRepeat
        );
        let oldValue = objectPath.get(
          documentDate,
          props.path,
          false
          );
          let oldValueLength = oldValue ? oldValue.length : 0;
          if (oldValueLength < newValue) {
            for (let i = oldValueLength; i < newValue; i++) {
              addData(i);
            }
          } else if (newValue < oldValueLength) {
        for (let i = oldValueLength - 1; i > newValue - 1; i--) {
          deleteHandler(i);
        }
      }
    }
  }, [
    documentDate,
    addData,
    props.repeatGroupWithQuery,
    props.repeatStepList,
    props.editRepeatStepListRepeat,
    deleteHandler,
    props.path,
    props.repeatGroupWithQuerySpecData
  ]);


    if (
      props.repeatGroupWithQuery &&
      props.repeatGroupWithQuerySpecData &&
      props.queryPath
    ) {
      let newValue = getRepeatNumber(
        props.specData,
        props.repeatGroupWithQuery,
        props.repeatStepList,
        props.editRepeatStepListRepeat
      );
      if (
        objectPath.get(
          documentDate,
          `${props.path}.${0}`,
          null
        ) === null
      ) {
        for (let i = 0; i < newValue; i++) {
          addData(i);
        }
      }
    }


  const Components = useMemo(() => CustomComponents[props.customComponent], [
    props.customComponent
  ]);

  // Checks for conditional rendering
  const showTitleOrSubtitle = !props.stopLoop && props.showEditButton;
  const showEditAll = props.showEditButton && !props.stopLoop && !writeChapter;
  const showLine = props.pageTitle && true;

  return (
    <div className={`${!props.lastChapter && "mb-4"}`}>
      <div className="d-flex justify-content-between align-items-end">
        {showTitleOrSubtitle ? (
          <Title key={`${props.thisChapter}-${props.index}-jja`}>
            {props.indexVariablePageTitle !== undefined
                ? variableString(
                    props.arrayIndex[props.indexVariablePageTitle ? props.indexVariablePageTitle : 0] + 1,
                    props.pageTitle
                  )
                : props.pageTitle}
          </Title>
        ) : (
          <Subtitle key={`${props.thisChapter}-${props.index}-jja`}>
            {props.pageTitle}
          </Subtitle>
        )}

        {showEditAll ? (
          <>
            <TabButton
              // size="sm"
              onClick={() => {
                // if (window.confirm("Are you sure you wish to edit?")) {
                setIsSubmitted(false);
                setEditChapter(props.thisChapter);
                setValidationPassed({});
                // }
              }}
              key={lastChapter}
            >
              Edit all
            </TabButton>
          </>
        ) : null}
      </div>
      {showLine && <Line />}
      {Components ? <Components {...props} /> : null}
      {props.fields ? (
        <>
          <SelectSetFieldGroupData
            {...props}
            writeChapter={writeChapter}
            deleteHandler={deleteHandler}
            addHandler={addHandler}

          />
          {!props.notAddButton && props.repeat && writeChapter ? (
            <button type="button" onClick={() => addHandler()}>
              {props.addButton ? props.addButton : "Add"}
            </button>
          ) : null}
        </>
      ) : props.type === "file" ? (
        <Input {...props} writeChapter={writeChapter} />
      ) : null}
      {props.showSaveButton ? (
        editChapter ? (
          props.thisChapter === editChapter && (
            <>
              <SubmitButton
                key={props.thisChapter}
                onClick={() =>
                  props.submitHandler(documentDate)
                }
              />
              {FieldsContext.isSubmitted && (
                <div style={{ fontSize: 12, color: "red" }}>
                  See Error Message
                </div>
              )}
            </>
          )
        ) : props.thisChapter === lastChapter ? (
          <>
            <SubmitButton
              key={props.thisChapter}
              onClick={() =>
                props.submitHandler(documentDate)
              }
              name={
                props.saveButton &&
                !Object.values(validationPassed).every(allTrue)
                  ? "Save"
                  : null
              }
            />
            {isSubmitted && (
              <div style={{ fontSize: 12, color: "red" }}>
                See Error Message
              </div>
            )}
          </>
        ) : null
      ) : null}
    </div>
  );
};
