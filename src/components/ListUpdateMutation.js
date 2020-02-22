import React, { useEffect, useContext, useState } from "react";
import MutationGeneral from "./MutationGeneral";
import { GruppContext, ValuesContext } from "./Book";
import { sumFieldInObject, getLastObjectValue } from "./Function";

export default props => {
  const gruppContext = useContext(GruppContext);
  const valuesContext = useContext(ValuesContext);
  const [form, setForm] = useState(false);
  const [addForm, setAddForm] = useState(0);

  useEffect(() => {
    setAddForm(0);
  }, [props.addForm]);
  // same as mutationgeneral
  useEffect(() => {
    if (props.allWaysShow) {
      setForm(true);
    } else if (gruppContext.gruppState) {
      if (props.count === gruppContext.gruppState) {
        setForm(true);
      } else {
        setForm(false);
      }
    } else if (props.count === gruppContext.grupp) {
      setForm(true);
    } else {
      setForm(false);
    }
  }, [props, gruppContext]);

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
      valuesContext.values[
        props.count +
          (props.updateQueryWithCount ? props.updateQueryWithCount : 0)
      ][props.updateQueryWithQueryName] !== undefined &&
      valuesContext.values[
        props.count +
          (props.updateQueryWithCount ? props.updateQueryWithCount : 0)
      ][props.updateQueryWithQueryName][0] !== undefined
    ) {
      let newValue;
      let object =
        valuesContext.values[
          props.count +
            (props.updateQueryWithCount ? props.updateQueryWithCount : 0)
        ][props.updateQueryWithQueryName];
      if (props.sumAllPage) {
        newValue = sumFieldInObject(object, props.updateQueryWithFieldName);
      } else if (props.useLastPage) {
        newValue = getLastObjectValue(object, props.updateQueryWithFieldName);
      } else {
        newValue =
          valuesContext.values[
            props.count +
              (props.updateQueryWithCount ? props.updateQueryWithCount : 0)
          ][props.updateQueryWithQueryName][0][props.updateQueryWithFieldName];
      }
      setAddForm(newValue - props.data.length);
    }
  }, [props.data, addForm, valuesContext.values]);

  let emptyFroms;
  if (addForm) {
    emptyFroms = [];
    for (let i = 0; i < addForm; i++) {
      emptyFroms.push(
        <MutationGeneral
          {...props}
          json={props.fields}
          key={`${(props.data && props.data.length ? props.data.length : 0) +
            i}-MutationGeneral`}
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
              gruppContext.setGruppState(props.count);
              props.setvalidationPassed({});
            }}
            key={gruppContext.grupp}
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
              valuesContext.values[props.count][props.name].splice(index, 1);
              return null;
            } else {
              return (
                <MutationGeneral
                  {...props}
                  key={`${index}-MutationGeneral`}
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
      {gruppContext.gruppState
        ? props.count === gruppContext.gruppState && button
        : props.count === gruppContext.grupp && button}
    </>
  );
};
