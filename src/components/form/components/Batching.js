import React, { Fragment } from "react";
import objectPath from "object-path";
import { Form } from "react-bootstrap";
import { findValue } from "functions/general";

export default props => {
  const allFields = (chapter, itemData) => {
    let batchingData = {};
    chapter.pages.forEach(page => {
      page.fields.forEach(field => {
        if (field.specValueList) {
          batchingData[field.fieldName] = findValue(
            itemData,
            field.specValueList,
            props.repeatStepList
          );
        } else if (field.fieldName && !props.partialBatching) {
          batchingData[field.fieldName] = findValue(
            itemData,
            Array.isArray(props.json.batching.dataPath)
              ? [...props.json.batching.dataPath, `data.${field.fieldName}`]
              : [props.json.batching.dataPath, `data.${field.fieldName}`],
            props.repeatStepList
          );
        }
      });
    });
    return batchingData
  };

  const add = (item, description, batchingData) => {
    props.setBatchingListIds(prevState => [...prevState, Number(item.id)]);
    if (!props.batchingData) {
      props.setBatchingData({ ...batchingData });
    }
    if (!props.indexItemList) {
      props.setIndexItemList(Number(description.id))
    }
    if (props.finishedItem) {
      props.setFinishedItem(0);
    }
  };
  const remove = item => {
    if (props.batchingListIds.length === 1) {
      props.setBatchingData(false);
      props.setIndexItemList(0)
    }
    if (props.finishedItem) {
      props.setFinishedItem(0);
    }
    props.setBatchingListIds(props.batchingListIds.filter(id => Number(id) !== Number(item.id)));
  };
  const handleClick = (e, item, description, batchingData) => {
    if (e.target.checked) {
      add(item, description, batchingData);
    } else {
      remove(item);
    }
  };

  const Item = ({description}) => {
    return objectPath
    .get(description, "items")
      .map((item, index) => {
        let batchingData = allFields(props.json.document.chapters[0], item);
        if (
          item.stage === props.stage &&
          (!props.batchingData ||
            JSON.stringify(batchingData) ===
              JSON.stringify(props.batchingData))
        ) {
          return (
            <Fragment key={`${index}-fragment`}>
              {props.partialBatching ? (
                <button
                  key={`${index}-button`}
                  onClick={() => {
                    props.setFinishedItem(Number(item.id));
                    props.setBatchingListIds([Number(item.id)]);
                  }}
                >
                  {" "}
                  Finished
                </button>
              ) : null}
              <Form.Check
                key={`${index}-check`}
                className="text-success"
                onChange={e => handleClick(e, item, description, batchingData)}
                id={`custom-${props.type}-${props.fieldName}-${props.indexId}`}
                checked={props.batchingListIds.find(id => Number(id) === Number(item.id))
                    ? true
                    : false
                }
                label={item.itemId}
              />
            </Fragment>
          );
        } else if (item.stage === props.stage) {
          // samme stage, men forskjellig data
          return (
            <div key={`${index}-text`} className="text-danger">
              {item.itemId}
            </div>
          );
        } else {
          //  På et annet stage
          return (
            <div key={`${index}-text`} className="text-danger">
              {item.itemId}
            </div>
          );
        }
      })
  }

  return (
    <>
      {props.data &&
        objectPath
          .get(props.data, "projects.0.descriptions")
          .map((description, index) => {
            if ((props.descriptionId && Number(description.id) === Number(props.descriptionId)) || Number(props.descriptionId) === 0) {
              return (
                <div className="text-center" key={index}>
                  <h5>{description.data.description} - {description.data.geometry} </h5>
                  <Item description={description} />
                </div>
                )
            } else {
              return null
            }
            })
          }
        </>
      )
};
