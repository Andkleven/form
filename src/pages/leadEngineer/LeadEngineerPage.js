import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query/query";
import leadEngineersCoatedItemJson from "templates/leadEngineerCoatedItem.json";
import leadEngineersMouldJson from "templates/leadEngineerMould.json";
import Form from "components/form/Form";
import PaperStack from "components/layout/PaperStack";
import Paper from "components/layout/Paper";
import { objectifyQuery, coatedItemOrMould } from "functions/general";
let leadEngineersJson = leadEngineersCoatedItemJson;
export default pageInfo => {
  const { descriptionId, itemId, different, geometry } = pageInfo.match.params;

  const [reRender, setReRender] = useState(false);
  const [fixedData, setFixedData] = useState(null);
  leadEngineersJson = coatedItemOrMould(
    geometry.toString(),
    leadEngineersCoatedItemJson,
    leadEngineersMouldJson
  );
  const { loading, error, data } = useQuery(query[leadEngineersJson.query], {
    variables: { id: itemId }
  });
  useEffect(() => {
    setFixedData(objectifyQuery(data));
  }, [loading, error, data, reRender]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <PaperStack>
      <Paper>
        {/* <Form
          componentsId={"leadEngineersPage"}
          document={leadEngineersJson}
          reRender={() => setReRender(!reRender)}
          data={fixedData}
          getQueryBy={itemId}
          descriptionId={descriptionId}
          itemId={itemId}
          sendItemId={Number(different)}
          finalButton={console.log("finalButton")}
        /> */}
      </Paper>
    </PaperStack>
  );
};
