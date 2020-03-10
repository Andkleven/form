import React from "react";
import OrderItem from "./OrderItem";

export default props => {
  const orders = props.orders.map((order, index) => {
    return (
      <OrderItem
        key={index}
        orderId={order.id}
        projectName={order.data.projectName ? order.data.projectName : ""}
        projectNumber={order.data.projectNumber ? order.data.projectNumber : ""}
        onDetail={props.onViewDetail}
      />
    );
  });
  return <ul className="events__list">{orders}</ul>;
};
