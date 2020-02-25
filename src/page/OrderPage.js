import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import OrderList from "../components/order/OrderList";
import query from "../request/leadEngineer/Query";
import history from "../history";
import orderJson from "../forms/Order.json";
import DocumentAndSubmit from "../components/DocumentAndSubmit";
import { Card, Container } from "react-bootstrap";

export default () => {
  const [updateOrder, setUpdateOrder] = useState(0);
  const [createOrder, setCreateOrder] = useState(false);
  const { loading, error, data } = useQuery(query[orderJson.query]);
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
        <Container className="mt-0 mt-sm-3 p-0">
          <Card
            className="shadow-sm"
            style={{ minHeight: "80vh", height: "100%" }}
          >
            <Card.Body>
              <DocumentAndSubmit
                componentsId={"orderPage"}
                buttonToEveryForm={true}
                notEditButton={true}
                allWaysShow={true}
                document={orderJson}
                data={createOrder ? null : data}
                arrayIndex={data.createProject.findIndex(
                  index => index.id === updateOrder
                )}
                reRender={pushHome}
              />
            </Card.Body>
          </Card>
        </Container>
      )}
    </>
  );
};
