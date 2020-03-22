import React, { useEffect, useContext, useState, Fragment } from "react";
import SetFieldGroupData from "./SetFieldGroupData";
import SubmitButton from "./SubmitButton";
import {
  ChapterContext,
  DocumentDateContext,
  FieldsContext
} from "./DocumentAndSubmit";
import { allTrue, findValue } from "./Functions";
import objectPath from "object-path";
import Title from "./Title";

export default props => {
  const chapterContext = useContext(ChapterContext);
  const documentDateContext = useContext(DocumentDateContext);
  const fieldsContext = useContext(FieldsContext);
  const [writeChapter, setWriteChapter] = useState(undefined);
  // const [repeatGroup, setRepeatGroup] = useState(0); // if repeat set number of repeat her

  // Set repeatGroup to zero on submit
  // useEffect(() => {
  //   setRepeatGroup(0);
  // }, [props.repeatGroup]);
  const addData = pushOnIndex => {
    documentDateContext.setDocumentDate(prevState => {
      objectPath.set(prevState, `${props.path}.${pushOnIndex}`, {
        data: {}
      });
      return {
        ...prevState
      };
    });
  };
  const addHandeler = () => {
    addData(
      objectPath.get(documentDateContext.documentDate, props.path).length
    );
  };
  const deleteHandler = index => {
    documentDateContext.setDocumentDate(prevState => {
      objectPath.del(prevState, `${props.path}.${index}`);
      return {
        ...prevState
      };
    });
  };

  // set repeatGroup
  useEffect(() => {
    if (props.allWaysShow) {
      setWriteChapter(true);
    } else if (chapterContext.editChapter) {
      if (props.thisChapter === chapterContext.editChapter) {
        setWriteChapter(true);
      } else {
        setWriteChapter(false);
      }
    } else if (props.thisChapter === chapterContext.lastChapter) {
      setWriteChapter(true);
    } else {
      setWriteChapter(false);
    }
  }, [
    props.allWaysShow,
    chapterContext.editChapter,
    props.thisChapter,
    chapterContext.lastChapter
  ]);

  // If repeat group start with one group set repeatGroup to 1
  useEffect(() => {
    if (
      props.repeatStartWithOneGroup &&
      writeChapter &&
      (!props.data || props.data.length === 0) &&
      Array.isArray(
        objectPath.get(documentDateContext.documentDate, props.path)
      ) &&
      objectPath.get(documentDateContext.documentDate, props.path).length === 0
    ) {
      addData(0);
    }
  }, [
    props.repeatStartWithOneGroup,
    writeChapter,
    props.data,
    chapterContext.editChapter,
    chapterContext.lastChapter
  ]);

  // If number of repeat group decides by a anthor field, it's sets repeatGroup
  useEffect(() => {
    if (
      props.repeatGroupWithQuery &&
      objectPath.get(
        props.repeatGroupWithQuerySpeckData
          ? props.speckData
          : documentDateContext.documentDate,
        props.path
      )
    ) {
      let newValue = findValue(
        props.repeatGroupWithQuerySpeckData
          ? props.speckData
          : documentDateContext.documentDate,
        props.repeatGroupWithQuery,
        props.repeatStepList,
        props.editRepeatStepListRepeat
      );
      if (Array.isArray(newValue)) {
        newValue = newValue.length;
      }
      let oldValueLength = objectPath.get(
        props.repeatGroupWithQuerySpeckData
          ? props.speckData
          : documentDateContext.documentDate,
        props.path
      ).length;
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
  }, [documentDateContext.documentDate]);
  return (
    <>
      {props.showEditButton && !props.stopLoop && !writeChapter ? (
        <>
          <br />
          <br />
          <br />
          <button
            type="button"
            onClick={() => {
              chapterContext.setEditChapter(props.thisChapter);
              fieldsContext.setvalidationPassed({});
            }}
            key={chapterContext.lastChapter}
          >
            Edit
          </button>
        </>
      ) : null}

      {!props.stopLoop ? (
        <Title
          key={`${props.thisChapter}-${props.index}-jja`}
          title={props.pageTitle}
        />
      ) : null}

      {props.repeat ? (
        props.data &&
        Array.isArray(props.data) &&
        objectPath.get(documentDateContext.documentDate, props.path) ? (
          objectPath
            .get(documentDateContext.documentDate, props.path)
            .map((itemsData, index) => {
              return (
                <Fragment key={index}>
                  <SetFieldGroupData
                    {...props}
                    repeatStepList={
                      props.repeatStepList !== undefined
                        ? [...props.repeatStepList, index]
                        : [index]
                    }
                    repeatStep={index}
                    writeChapter={writeChapter}
                    key={`${props.indexId}-${index}`}
                    data={itemsData}
                    path={props.path ? `${props.path}.${index}` : null}
                    fields={props.fields}
                    step={index}
                    indexId={`${props.indexId}-${index}`}
                  />
                  {props.delete && writeChapter ? (
                    <button
                      type="button"
                      key={index}
                      onClick={() => deleteHandler(index)}
                    >
                      {"❌"}
                    </button>
                  ) : null}
                </Fragment>
              );
            })
        ) : null
      ) : (
        <SetFieldGroupData
          {...props}
          repeatStepList={
            props.repeatStepList !== undefined
              ? [...props.repeatStepList, 0]
              : [0]
          }
          // path={props.path ? `${props.path}.0` : null}
          repeatStep={0}
          writeChapter={writeChapter}
          data={props.data}
          fields={props.fields}
          step={0}
          indexId={`${props.indexId}-0`}
        />
      )}
      <>
        {!props.notAddButton && props.repeat && writeChapter ? (
          <button type="button" onClick={() => addHandeler()}>
            {props.addButton ? props.addButton : "Add"}
          </button>
        ) : null}
      </>
      {props.showSaveButton ? (
        chapterContext.editChapter ? (
          props.thisChapter === chapterContext.editChapter && (
            <>
              <SubmitButton
                key={props.thisChapter}
                onClick={() =>
                  props.submitHandler(documentDateContext.documentDate)
                }
              />
              {FieldsContext.isSubmited && (
                <div style={{ fontSize: 12, color: "red" }}>
                  See Error Message
                </div>
              )}
            </>
          )
        ) : props.thisChapter === chapterContext.lastChapter ? (
          <>
            <SubmitButton
              key={props.thisChapter}
              onClick={() =>
                props.submitHandler(documentDateContext.documentDate)
              }
              name={
                props.saveButton &&
                !Object.values(fieldsContext.validationPassed).every(allTrue)
                  ? "Save"
                  : null
              }
            />
            {fieldsContext.isSubmited && (
              <div style={{ fontSize: 12, color: "red" }}>
                See Error Message
              </div>
            )}
          </>
        ) : null
      ) : null}
    </>
  );
};
