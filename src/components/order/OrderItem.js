import React from "react";

const OrderItem = props => (
  <li key={props.orderId} className="events__list-items">
    <div>
      <h1>{props.projectName}</h1>
      <h2>{props.projectNumber}</h2>
      <h2>{props.asd}</h2>
    </div>
    <div>
      <button
        className="btn"
        onClick={props.onDetail.bind(this, props.orderId)}
      >
        Update
      </button>
    </div>
  </li>
);

export default OrderItem;
