import React from "react";
import objectPath from "object-path";
import { Form } from "react-bootstrap";
import { getDataFromQuery, stringToDictionary } from "components/Functions";

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
    props.setFinishedItem(0);
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
      {props.data &&
        objectPath
          .get(props.data, props.json.batching.itemPath)
          .map((item, index) => {
            let batchingData = {};
            props.json.batching.dataField.forEach(field => {
              batchingData[field] = getDataFromQuery(
                item,
                props.json.batching.dataPath + "0",
                field
              );
            });
            if (
              item.stage === props.stage &&
              (!props.batchingData ||
                JSON.stringify(batchingData) ===
                  JSON.stringify(props.batchingData))
            ) {
              return (
                <>
                  {props.partialBatching ? (
                    <button
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
                    label={
                      stringToDictionary(item.data)[
                        props.json.batching.showField
                      ]
                    }
                  />
                </>
              );
            } else {
              //  fade out check box
              return (
                <div key={index} className="text-danger">
                  {stringToDictionary(item.data)[props.json.batching.showField]}
                </div>
              );
            }
          })}
    </>
  );
};
