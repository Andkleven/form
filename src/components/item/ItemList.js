import React from "react";

import Item from "./Item";

const OrderList = props => {
  const itemsm = props.itemss.map(items => {
    let data = {};
    if (items.data.trim() !== "") {
      data = JSON.parse(items.data.replace(/'/g, '"'));
    }
    return (
      <Item
        key={items.id}
        items={items}
        data={data}
        submitItem={props.submitItem}
        submitDelete={props.submitDelete}
      />
    );
  });
  return <ul className="events__list">{itemsm}</ul>;
};

export default OrderList;
