import React, { Fragment } from "react";
import objectPath from "object-path";
import { Form } from "react-bootstrap";
import { findValue } from "components/Functions";

export default props => {
  const add = (item, batchingData) => {
    props.setBatchingListIds(prevState => [...prevState, Number(item.id)]);
    if (!props.batchingData) {
      props.setBatchingData({ ...batchingData });
    }
  };
  const remove = item => {
    if (props.batchingListIds.length === 1) {
      props.setBatchingData(false);
    }
    if (props.finishedItem) {
      props.setFinishedItem(0);
    }
    props.setBatchingListIds(props.batchingListIds.filter(id => id != item.id));
  };
  const handelClick = (e, item, batchingData) => {
    if (e.target.checked) {
      add(item, batchingData);
    } else {
      remove(item);
    }
  };
  return (
    <>
      <h3 className={"text-center"}>Batching</h3>
      {props.data &&
        objectPath
          .get(props.data, props.json.batching.itemPath)
          .map((item, index) => {
            let batchingData = {};
            props.json.batching.dataField.forEach(field => {
              batchingData[field] = findValue(
                item,
                `${props.json.batching.dataPath}.0.data.${field}`
              );
            });
            if (
              item.stage === props.stage &&
              (!props.batchingData ||
                JSON.stringify(batchingData) ===
                  JSON.stringify(props.batchingData))
            ) {
              return (
                <Fragment key={index}>
                  {props.partialBatching ? (
                    <button
                      key={index}
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
                    key={index}
                    className="text-success"
                    onChange={e => handelClick(e, item, batchingData)}
                    id={`custom-${props.type}-${props.fieldName}-${
                      props.indexId
                    }`}
                    checked={
                      props.batchingListIds.find(id => id == item.id)
                        ? true
                        : false
                    }
                    label={item.data[props.json.batching.showField]}
                  />
                </Fragment>
              );
            } else {
              //  fade out check box?
              return (
                <div key={index} className="text-danger">
                  {item.data[props.json.batching.showField]}
                </div>
              );
            }
          })}
    </>
  );
};
