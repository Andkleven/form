import React from "react";
import objectPath from "object-path";
import { Form } from "react-bootstrap";

const stage = "priming";

export default props => {
  const add = (items, data) => {
    let batchingData;
    props.json.dataField.forEach(field => {
      batchingData[field] = data[field];
    });

    props.setBatchingListIds(prevState => [...prevState, items.id]);
    if (batchingData) {
      props.setBatchingData({ ...batchingData });
    }
  };
  const remove = items => {
    if (props.batchingListIds.length === 1) {
      props.setBatchingData(false);
    }
    props.setBatchingListIds(
      props.batchingListIds.filter(id => id !== items.id)
    );
  };
  const handelClick = (e, items, data) => {
    if (e.target.value) {
      add(items, data);
    } else {
      remove(items);
    }
  };

  return (
    <>
      {objectPath.get(props.data, props.json.dataPath).map((items, index) => {
        let batchingData;
        let data = JSON.parse(items.data.replace(/'/g, '"'));
        props.json.dataField.forEach(field => {
          batchingData[field] = data[field];
        });
        if (
          items.stage === stage ||
          JSON.stringify(data) === JSON.stringify(props.batchingData)
        ) {
          //  fade out check box
          return (
            <Form.Check
              key={index}
              id={`custom-${props.type}-${props.fieldName}-${props.indexId}`}
              label={JSON.parse(items.replace(/'/g, '"'))[props.json.showField]}
            />
          );
        } else {
          return (
            <Form.Check
              key={index}
              onChange={e => handelClick(e, items, data)}
              id={`custom-${props.type}-${props.fieldName}-${props.indexId}`}
              label={JSON.parse(items.replace(/'/g, '"'))[props.json.showField]}
            />
          );
        }
      })}
    </>
  );
};
