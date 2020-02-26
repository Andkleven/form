import React, { useEffect, useContext, useState } from "react";
import SetFieldGroupData from "./SetFieldGroupData";
import {
  ChapterContext,
  DocumentDateContext,
  FieldsContext
} from "./DocumentAndSubmit";
import { sumFieldInObject, getLastObjectValue } from "./Functions";
import Title from "./Title";

export default props => {
  const chapterContext = useContext(ChapterContext);
  const documentDateContext = useContext(DocumentDateContext);
  const fieldsContext = useContext(FieldsContext);
  const [writeChapter, setWriteChapter] = useState(undefined);
  const [repeatGroup, setRepeatGroup] = useState(0); // if repeat set number of repeat her

  // Set repeatGroup to zero on submit
  useEffect(() => {
    setRepeatGroup(0);
  }, [props.repeatGroup]);

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
      !repeatGroup &&
      (!props.data || props.data.length === 0)
    ) {
      setRepeatGroup(1);
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
      props.repeatGroupWithFieldName &&
      props.repeatGroupWithPageName &&
      documentDateContext.documentDate[
        props.thisChapter +
          (props.repeatGroupWithChapter ? props.repeatGroupWithChapter : 0)
      ][props.repeatGroupWithPageName] !== undefined &&
      documentDateContext.documentDate[
        props.thisChapter +
          (props.repeatGroupWithChapter ? props.repeatGroupWithChapter : 0)
      ][props.repeatGroupWithPageName][0] !== undefined
    ) {
      let newValue;
      let object =
        documentDateContext.documentDate[
          props.thisChapter +
            (props.repeatGroupWithChapter ? props.repeatGroupWithChapter : 0)
        ][props.repeatGroupWithPageName];
      if (props.sumAllPage) {
        newValue = sumFieldInObject(object, props.repeatGroupWithFieldName);
      } else if (props.useLastPage) {
        newValue = getLastObjectValue(object, props.repeatGroupWithFieldName);
      } else {
        newValue =
          documentDateContext.documentDate[
            props.thisChapter +
              (props.repeatGroupWithChapter ? props.repeatGroupWithChapter : 0)
          ][props.repeatGroupWithPageName][0][props.repeatGroupWithFieldName];
      }
      setRepeatGroup(newValue - props.data.length);
    }
  }, [props.data, repeatGroup, documentDateContext.documentDate]);

  // sets field group without data
  let emptyGroup;
  if (repeatGroup && props.repeat) {
    emptyGroup = [];
    for (let i = 0; i < repeatGroup; i++) {
      emptyGroup.push(
        <SetFieldGroupData
          {...props}
          writeChapter={writeChapter}
          fields={props.fields}
          key={`${props.indexId}-${(props.data && props.data.length
            ? props.data.length
            : 0) + i}`}
          data={false}
          repeatStep={
            (props.data && props.data.length ? props.data.length : 0) + i
          }
          indexId={`${props.indexId}-${(props.data && props.data.length
            ? props.data.length
            : 0) + i}`}
        />
      );
    }
  } else {
    emptyGroup = null;
  }
  // Test if you need add button or delete button
  const button = (
    <>
      {!props.notAddButton ? (
        <button onClick={() => setRepeatGroup(repeatGroup + 1)}>
          {props.addButton ? props.addButton : "Add"}
        </button>
      ) : null}
      {props.delete}
      {props.delete && (repeatGroup || (props.data && props.data.length)) ? (
        <button onClick={() => setRepeatGroup(repeatGroup - 1)}>Delete</button>
      ) : null}
    </>
  );

  return (
    <>
      {props.showEditButton && !props.stopLoop && !writeChapter ? (
        <>
          <br />
          <br />
          <br />
          <button
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

      {!props.onePage && props.data && Array.isArray(props.data) ? (
        props.data.map((itemData, index) => {
          if (props.data.length + repeatGroup - 1 < index) {
            delete documentDateContext.documentDate[props.thisChapter][
              props.pageName
            ][index];
            return null;
          } else {
            return (
              <SetFieldGroupData
                {...props}
                writeChapter={writeChapter}
                key={`${props.indexId}-${index}`}
                data={itemData}
                fields={props.fields}
                step={index}
                repeatStep={index}
                indexId={`${props.indexId}-${index}`}
              />
            );
          }
        })
      ) : (
        <SetFieldGroupData
          {...props}
          writeChapter={writeChapter}
          key={`${0}-SetFieldGroupData`}
          data={props.data}
          fields={props.fields}
          step={0}
          repeatStep={0}
          indexId={`${props.indexId}-0`}
        />
      )}
      {emptyGroup ? emptyGroup : null}
      {props.repeat ? writeChapter && button : null}
    </>
  );
};
