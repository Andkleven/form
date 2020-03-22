import React from "react";

const OrderItem = props => (
  <li key={props.id}>
    <div>
      <h1>
        {props.item.id}
        {props.item.data.itemId}
      </h1>
    </div>
    <div>
      <button className="btn" onClick={props.submitItem.bind(this, props.item)}>
        Item
      </button>
      <button
        className="btn"
        onClick={props.submitDelete.bind(this, props.item.id)}
      >
        Delete
      </button>
    </div>
  </li>
);

export default OrderItem;
