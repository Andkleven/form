import React, { useEffect, useContext, useState } from "react";
import SetFieldGroupData from "./SetFieldGroupData";
import { ChapterContext, DocumentDateContext, ValidationContext } from "./DocumentAndSubmit";
import { sumFieldInObject, getLastObjectValue } from "./Function";
import Title from "./Title";

export default props => {
  const chapterContext = useContext(ChapterContext);
  const documentDateContext = useContext(DocumentDateContext);
  const validationContext = useContext(ValidationContext);
  const [writeChapter, setWriteChapter] = useState(undefined);
  const [addForm, setAddForm] = useState(0);

  useEffect(() => {
    setAddForm(0);
  }, [props.addForm]);
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
  }, [props, chapterContext]);

  useEffect(() => {
    if (
      props.startWithOne &&
      writeChapter &&
      !addForm &&
      (!props.data || props.data.length === 0)
    ) {
      setAddForm(1);
    }
  }, [
    props.startWithOne,
    writeChapter,
    props.data,
    chapterContext.editChapter,
    chapterContext.lastChapter
  ]);

  useEffect(() => {
    if (
      props.updateQueryWithFieldName &&
      props.updateQueryWithQueryName &&
      documentDateContext.documentDate[
        props.thisChapter +
          (props.updateQueryWithCount ? props.updateQueryWithCount : 0)
      ][props.updateQueryWithQueryName] !== undefined &&
      documentDateContext.documentDate[
        props.thisChapter +
          (props.updateQueryWithCount ? props.updateQueryWithCount : 0)
      ][props.updateQueryWithQueryName][0] !== undefined
    ) {
      let newValue;
      let object =
        documentDateContext.documentDate[
          props.thisChapter +
            (props.updateQueryWithCount ? props.updateQueryWithCount : 0)
        ][props.updateQueryWithQueryName];
      if (props.sumAllPage) {
        newValue = sumFieldInObject(object, props.updateQueryWithFieldName);
      } else if (props.useLastPage) {
        newValue = getLastObjectValue(object, props.updateQueryWithFieldName);
      } else {
        newValue =
          documentDateContext.documentDate[
            props.thisChapter +
              (props.updateQueryWithCount ? props.updateQueryWithCount : 0)
          ][props.updateQueryWithQueryName][0][props.updateQueryWithFieldName];
      }
      setAddForm(newValue - props.data.length);
    }
  }, [props.data, addForm, documentDateContext.documentDate]);

  let emptyFroms;
  if (addForm && props.repeat) {
    emptyFroms = [];
    for (let i = 0; i < addForm; i++) {
      emptyFroms.push(
        <SetFieldGroupData
          {...props}
          writeChapter={writeChapter}
          fields={props.fields}
          key={`${props.indexId}-${(props.data && props.data.length ? props.data.length : 0) +
            i}`}
          data={false}
          listIndex={
            (props.data && props.data.length ? props.data.length : 0) + i
          }
          indexId={`${props.indexId}-${(props.data && props.data.length
            ? props.data.length
            : 0) + i}`}
        />
      );
    }
  } else {
    emptyFroms = null;
  }
  const button = (
    <>
      {!props.notAddButton ? (
        <button onClick={() => setAddForm(addForm + 1)}>
          {props.addButton ? props.addButton : "Add"}
        </button>
      ) : null}
      {props.delete}
      {props.delete && (addForm || (props.data && props.data.length)) ? (
        <button onClick={() => setAddForm(addForm - 1)}>Delete</button>
      ) : null}
    </>
  );
  return (
    <>
      {props.showEidtButton && !props.stopLoop && !writeChapter ? (
        <>
          <br />
          <br />
          <br />
          <button
            onClick={() => {
              chapterContext.setEditChapter(props.thisChapter);
              validationContext.setvalidationPassed({});
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
          if (props.data.length + addForm - 1 < index) {
            delete documentDateContext.documentDate[props.thisChapter][
              props.name
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
                listIndex={index}
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
          listIndex={0}
          indexId={`${props.indexId}-${index}`}
        />
      )}
      {emptyFroms ? emptyFroms : null}
      {props.repeat
        ? chapterContext.editChapter
          ? props.thisChapter === chapterContext.editChapter && button
          : props.thisChapter === chapterContext.lastChapter && button
        : null}
    </>
  );
};
