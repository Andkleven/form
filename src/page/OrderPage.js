import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import OrderList from "../components/order/OrderList";
import query from "../request/leadEngineer/Query";
import history from "../history";
import orderJson from "../forms/Order.json";
import DocumentAndSubmit from "../components/DocumentAndSubmit";
import Paper from "components/Paper";
import { stringToDictionaryForAQuery } from "components/Functions";

export default () => {
  const [updateOrder, setUpdateOrder] = useState(0);
  const [createOrder, setCreateOrder] = useState(false);
  const { loading, error, data } = useQuery(query[orderJson.query]);
  useEffect(() => {
    if (!loading && !error) {
      stringToDictionaryForAQuery(data);
    }
  }, [loading, error]);
  console.log(loading, error);
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
    const { id } = data.projects.new;
    history.push(`/order/item/${id}`);
  };
  console.log(data);
  return (
    <Paper>
      <button onClick={() => newForm()}>Create Project</button>
      {data.projects ? (
        <OrderList
          orders={data.projects}
          onViewDetail={id => {
            updateForm(id);
          }}
        />
      ) : null}
      {(updateOrder || createOrder) && (
        <DocumentAndSubmit
          componentsId={"orderPage"}
          buttonToEveryForm={true}
          notEditButton={true}
          allWaysShow={true}
          document={orderJson}
          data={
            createOrder
              ? null
              : data.projects.find(element => element.id === updateOrder)
          }
          // arrayIndex={
          //   data.projects
          //     ? data.projects.findIndex(index => index.id === updateOrder)
          //     : 0
          // }
          reRender={pushHome}
        />
      )}
    </Paper>
  );
};
