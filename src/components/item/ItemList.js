import React from "react";

import Item from "./Item";

const OrderList = props => {
  const itemm = props.items.map(item => {
    var data = {};
    if (item.data.trim() !== "") {
      data = JSON.parse(item.data.replace(/'/g, '"'));
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
  return <ul className="events__list">{itemm}</ul>;
};

export default OrderList;
