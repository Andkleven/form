import React from "react";
import { Button } from "react-bootstrap";

const OrderItem = props => (
  <div key={props.orderId} className="events__list-item">
    <div>
      <div>{props.projectName}</div>
      <div>{props.projectNumber}</div>
      <div>{props.asd}</div>
    </div>
    <div>
      <Button
        variant="light"
        className="border"
        onClick={props.onDetail.bind(this, props.orderId)}
      >
        Update
      </Button>
    </div>
  </div>
);

export default OrderItem;
