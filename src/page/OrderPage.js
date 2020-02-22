import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import OrderList from "../components/order/OrderList";
import query from "../request/leadEngineer/Query";
import history from "../history";
import orderJson from "../forms/Order.json";
import Book from "../components/Book";

function OrderPage() {
  const [updateOrder, setUpdateOrder] = useState(0);
  const [createOrder, setCreateOrder] = useState(false);
  const { loading, error, data } = useQuery(query["GET_ORDER"]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const newForm = () => {
    setCreateOrder(true);
    setUpdateOrder(0);
  };
  const updateForm = id => {
    setCreateOrder(false);
    setUpdateOrder(id);
  };
  const pushHome = data => {
    const { id } = data.createProject.new;
    history.push(`/order/item/${id}`);
  };

  return (
    <>
      <button onClick={() => newForm()}>Create Project</button>
      <OrderList
        orders={data.createProject}
        onViewDetail={id => {
          updateForm(id);
        }}
      />
      {(updateOrder || createOrder) && (
        <Book
          componentsId={"orderPage"}
          buttonToEveryForm={true}
          notEidtButton={true}
          allWaysShow={true}
          json={orderJson}
          data={createOrder ? null : data}
          arrayIndex={data.createProject.findIndex(
            index => index.id === updateOrder
          )}
          reRender={pushHome}
        />
      )}
    </>
  );
}

export default OrderPage;
