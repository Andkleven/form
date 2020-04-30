import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import leadEngineersCoatedItemJson from "../forms/LeadEngineerCoatedItem.json";
import leadEngineersMouldJson from "../forms/LeadEngineerMould.json";
import DocumentAndSubmit from "components/DocumentAndSubmit";
import PaperStack from "components/layout/PaperStack";
import Paper from "components/layout/Paper";
import { objectifyQuery, coatedItemORMould } from "functions/general";
let leadEngineersJson = leadEngineersCoatedItemJson;
export default pageInfo => {
  const { descriptionId, itemId, different, geometry } = pageInfo.match.params;

  const [reRender, setReRender] = useState(false);
  const [fixedData, setFixedData] = useState(null);
  leadEngineersJson = coatedItemORMould(
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
        <DocumentAndSubmit
          componentsId={"leadEngineersPage"}
          document={leadEngineersJson}
          reRender={() => setReRender(!reRender)}
          data={fixedData}
          getQueryBy={itemId}
          descriptionId={descriptionId}
          itemId={itemId}
          sendItemId={Number(different)}
        />
      </Paper>
    </PaperStack>
  );
};
