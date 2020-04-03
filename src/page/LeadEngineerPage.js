import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import leadEngineersCoatedItemJson from "../forms/LeadEngineerCoatedItem.json";
import leadEngineersMouldJson from "../forms/LeadEngineerMould.json";
import DocumentAndSubmit from "components/DocumentAndSubmit";
import PaperStack from "components/PaperStack";
import Paper from "components/Paper";
import { objectifyQuery, coatedItemORMould } from "components/Functions";

export default pageInfo => {
  const { descriptionId, itemId, different } = pageInfo.match.params;
<<<<<<< HEAD
=======
  // console.log(descriptionId, itemId, different);
>>>>>>> master
  const [reRender, setReRender] = useState(false);
  const [fixedData, setFixedData] = useState(null);
  const { loading1, error1, data: getGategory } = useQuery(
    query["GET_GEOMETRY"],
    {
      variables: { id: descriptionId }
    }
  );
  let gategory = objectifyQuery(getGategory);
  let leadEngineersJson = coatedItemORMould(
    gategory.data.description,
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
  if (loading1) return <p>Loading...</p>;
  if (error1) return <p>Error :(</p>;
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
