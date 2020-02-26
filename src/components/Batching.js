import React from "react";
import objectPath from "object-path";
import { Form } from "react-bootstrap";

const stage = "priming";

export default props => {
  const add = (item, data) => {
    let batchingData;
    props.json.dataField.forEach(field => {
      batchingData[field] = data[field];
    });

    props.setBatchingListIds(prevState => [...prevState, item.id]);
    if (batchingData) {
      props.setBatchingData({ ...batchingData });
    }
  };
  const remove = item => {
    if (props.batchingListIds.length === 1) {
      props.setBatchingData(false);
    }
    props.setBatchingListIds(
      props.batchingListIds.filter(id => id !== item.id)
    );
  };
  const handelClick = (e, item, data) => {
    if (e.target.value) {
      add(item, data);
    } else {
      remove(item);
    }
  };

  return (
    <>
      {objectPath.get(props.data, props.json.dataPath).map((item, index) => {
        let batchingData;
        let data = JSON.parse(item.data.replace(/'/g, '"'));
        props.json.dataField.forEach(field => {
          batchingData[field] = data[field];
        });
        if (
          item.stage === stage ||
          JSON.stringify(data) === JSON.stringify(props.batchingData)
        ) {
          //  fade out check box
          return (
            <Form.Check
              key={index}
              id={`custom-${props.type}-${props.fieldName}-${props.indexId}`}
              label={JSON.parse(item.replace(/'/g, '"'))[props.json.showField]}
            />
          );
        } else {
          return (
            <Form.Check
              key={index}
              onChange={e => handelClick(e, item, data)}
              id={`custom-${props.type}-${props.fieldName}-${props.indexId}`}
              label={JSON.parse(item.replace(/'/g, '"'))[props.json.showField]}
            />
          );
        }
      })}
    </>
  );
};
