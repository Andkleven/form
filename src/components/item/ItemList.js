import React from "react";
import { stringToDictionary } from "components/Functions";
import Item from "./Item";

const OrderList = props => {
  const items = props.items.map(item => {
    let data = {};
    if (item.data.trim() !== "") {
      data = stringToDictionary(item.data);
    }
    return (
      <Item
        key={item.id}
        item={item}
        data={data}
        submitItem={props.submitItem}
        submitDelete={props.submitDelete}
      />
    );
  });
  return <ul className="events__list">{items}</ul>;
};

export default OrderList;
