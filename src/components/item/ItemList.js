import React from "react";
import Item from "./Item";

const OrderList = props => {
  const items = props.items.map((item, index) => {
    return (
      <Item
        key={index}
        item={item}
        submitItem={props.submitItem}
        submitDelete={props.submitDelete}
      />
    );
  });
  return <ul className="events__list">{items}</ul>;
};

export default OrderList;
