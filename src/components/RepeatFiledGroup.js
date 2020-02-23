import React, { useEffect, useContext, useState } from "react";
import SetFieldGroupData from "./SetFieldGroupData";
import { ChapterContext, DocumentDateContext } from "./Document";
import { sumFieldInObject, getLastObjectValue } from "./Function";

export default props => {
  const chapterContext = useContext(ChapterContext);
  const documentDateContext = useContext(DocumentDateContext);
  const [form, setForm] = useState(false);
  const [addForm, setAddForm] = useState(0);

  useEffect(() => {
    setAddForm(0);
  }, [props.addForm]);
  // same as mutationgeneral
  useEffect(() => {
    if (props.allWaysShow) {
      setForm(true);
    } else if (chapterContext.chapter) {
      if (props.thisChapter === chapterContext.chapter) {
        setForm(true);
      } else {
        setForm(false);
      }
    } else if (props.thisChapter === chapterContext.lastChapter) {
      setForm(true);
    } else {
      setForm(false);
    }
  }, [props, chapterContext]);

  useEffect(() => {
    if (
      props.startWithOne &&
      form &&
      !addForm &&
      (!props.data || props.data.length === 0)
    ) {
      setAddForm(1);
    }
  }, [props.startWithOne, form, props.data]);

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
  if (addForm) {
    emptyFroms = [];
    for (let i = 0; i < addForm; i++) {
      emptyFroms.push(
        <SetFieldGroupData
          {...props}
          json={props.fields}
          key={`${(props.data && props.data.length ? props.data.length : 0) +
            i}-SetFieldGroupData`}
          title=""
          data={false}
          listIndex={
            (props.data && props.data.length ? props.data.length : 0) + i
          }
          index={`${props.index}-${(props.data && props.data.length
            ? props.data.length
            : 0) + i}`}
          showEidtButton={false}
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
      {props.showEidtButton && !props.stopLoop && !form ? (
        <>
          <br />
          <br />
          <br />
          <button
            onClick={() => {
              chapterContext.setChapter(props.thisChapter);
              props.setvalidationPassed({});
            }}
            key={chapterContext.lastChapter}
          >
            Edit
          </button>
        </>
      ) : null}
      {props.title && (form || (!form && props.data && props.data.length)) ? (
        <>
          <br />
          <br />
          <h1 className="text-center">{props.title}</h1>
          <hr className="w-100 mt-0 mb-1 p-0" />
        </>
      ) : null}

      {props.data
        ? props.data.map((itemData, index) => {
            if (props.data.length + addForm - 1 < index) {
              documentDateContext.documentDate[props.thisChapter][props.name].splice(index, 1);
              return null;
            } else {
              return (
                <SetFieldGroupData
                  {...props}
                  key={`${index}-SetFieldGroupData`}
                  title=""
                  data={itemData}
                  json={props.fields}
                  step={index}
                  listIndex={index}
                  index={`${props.index}-${index}`}
                  showEidtButton={false}
                />
              );
            }
          })
        : null}
      {emptyFroms ? emptyFroms : null}
      {chapterContext.chapter
        ? props.thisChapter === chapterContext.chapter && button
        : props.thisChapter === chapterContext.lastChapter && button}
    </>
  );
};
