import React, { useMemo } from "react";
import objectPath from "object-path";
import { Form } from "react-bootstrap";
import { stringToDictionary } from "components/Functions";

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
      {useMemo(
        () =>
          props.data &&
          objectPath.get(props.data, props.json.itemPath).map((item, index) => {
            let batchingData = {};
            props.json.dataField.forEach(field => {
              batchingData[field] = stringToDictionary(
                objectPath.get(item, props.json.dataPath)[0].data
              )[field];
            });
            if (
              item.stage === props.stage &&
              (!props.batchingData ||
                JSON.stringify(batchingData) ===
                  JSON.stringify(props.batchingData))
            ) {
              return (
                <Form.Check
                  key={index}
                  className="text-success"
                  onChange={e => handelClick(e, item, batchingData)}
                  id={`custom-${props.type}-${props.fieldName}-${
                    props.indexId
                  }`}
                  checked={props.batchingListIds.find(id => id == item.id)}
                  label={stringToDictionary(item.data)[props.json.showField]}
                />
              );
            } else {
              //  fade out check box
              return (
                <div key={index} className="text-danger">
                  {stringToDictionary(item.data)[props.json.showField]}
                </div>
              );
            }
          }),
        [props.batchingData, props.batchingListIds]
      )}
    </>
  );
};
