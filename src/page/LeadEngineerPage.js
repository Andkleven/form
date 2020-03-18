import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import leadEngineersJson from "../forms/LeadEngineer.json";
import DocumentAndSubmit from "components/DocumentAndSubmit";
import Paper from "components/Paper";
import { objectifyQuery } from "components/Functions";

export default pageInfo => {
  const { descriptionId, itemId, different } = pageInfo.match.params;
  const [reRender, setReRender] = useState(false);
  const [fixedData, setFixedData] = useState(null);
  // const { loading1, error1, data: getGategory } = useQuery(query["GET_GEOMETRY"], {
  //   variables: { id: descriptionId }
  // });
  const { loading, error, data } = useQuery(query[leadEngineersJson.query], {
    variables: { id: itemId }
  });
  useEffect(() => {
    setFixedData(objectifyQuery(data));
  }, [loading, error, data, reRender]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  // if (loading1) return <p>Loading...</p>;
  // if (error1) return <p>Error :(</p>;
  return (
    <Paper>
      <DocumentAndSubmit
        componentsId={"leadEngineersPage"}
        document={leadEngineersJson}
        submitOneField={true}
        reRender={() => setReRender(!reRender)}
        data={fixedData}
        getQueryBy={itemId}
        descriptionId={descriptionId}
        itemId={itemId}
        different={different}
      />
    </Paper>
  );
};
