import React from "react";

const OrderItem = props => (
  <li key={props.id}>
    <div>
      <h1>
        {props.items.id}
        {props.data.itemsId}
      </h1>
    </div>
    <div>
      <button className="btn" onClick={props.submitItem.bind(this, props.items)}>
        Item
      </button>
      <button
        className="btn"
        onClick={props.submitDelete.bind(this, props.items.id)}
      >
        Delete
      </button>
    </div>
  </li>
);

export default OrderItem;
