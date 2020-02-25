import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import leadEngineerJson from "../forms/LeadEngineer.json";
import DocumentAndSubmit from "../components/DocumentAndSubmit";
import { Card, Container } from "react-bootstrap";

export default pageInfo => {
  const { categoryId, itemId, different } = pageInfo.match.params;
  const [reRender, setReRender] = useState(false);
  // const { loading1, error1, data: getGategory } = useQuery(query["GET_GEOMETRY"], {
  //   variables: { id: categoryId }
  // });
  const { loading, error, data } = useQuery(query[leadEngineerJson.query], {
    variables: { id: itemId }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  // if (loading1) return <p>Loading...</p>;
  // if (error1) return <p>Error :(</p>;
  return (
    <>
      {
        <Container className="mt-0 mt-sm-3 p-0">
          <Card
            className="shadow-sm"
            style={{ minHeight: "80vh", height: "100%" }}
          >
            <Card.Body>
              <DocumentAndSubmit
                componentsId={"leadEngineerPage"}
                document={leadEngineerJson}
                reRender={() => setReRender(!reRender)}
                data={data}
                getQueryBy={itemId}
                categoryId={categoryId}
                itemId={itemId}
                different={different}
              />
            </Card.Body>
          </Card>
        </Container>
      }
    </>
  );
};
