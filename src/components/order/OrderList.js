import React from "react";

import OrderItem from "./OrderItem";

const OrderList = props => {
  const orders = props.orders.map((order, index) => {
    var data = {};
    if (order.data.trim() !== "") {
      data = JSON.parse(order.data.replace(/'/g, '"'));
    }
    return (
      <OrderItem
        key={JSON.stringify(index) + "OrderItem" + JSON.stringify(order.id)}
        orderId={order.id}
        projectName={data.projectName ? data.projectName : ""}
        projectNumber={data.projectNumber ? data.projectNumber : ""}
        onDetail={props.onViewDetail}
      />
    );
  });
  return <ul className="events__list">{orders}</ul>;
};

export default OrderList;
