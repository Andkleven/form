import React from "react";
import stringToDictionary from "components/Functions";
import OrderItem from "./OrderItem";

const OrderList = props => {
  const orders = props.orders.map((order, index) => {
    let data = {};
    if (order.data.trim() !== "") {
      data = stringToDictionary(order.data);
    }
    return (
      <OrderItem
        key={JSON.stringify(index) + "OrderItem" + JSON.stringify(order.id)}
        orderId={order.id}
        projectsName={data.projectsName ? data.projectsName : ""}
        projectsNumber={data.projectsNumber ? data.projectsNumber : ""}
        onDetail={props.onViewDetail}
      />
    );
  });
  return <ul className="events__list">{orders}</ul>;
};

export default OrderList;
