import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineers/Query";
import leadEngineersJson from "../forms/LeadEngineer.json";
import DocumentAndSubmit from "components/DocumentAndSubmit";
import Paper from "components/Paper";

export default pageInfo => {
  const { descriptionsId, itemsId, different } = pageInfo.match.params;
  const [reRender, setReRender] = useState(false);
  // const { loading1, error1, data: getGategory } = useQuery(query["GET_GEOMETRY"], {
  //   variables: { id: descriptionsId }
  // });
  const { loading, error, data } = useQuery(query[leadEngineersJson.query], {
    variables: { id: itemsId }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  // if (loading1) return <p>Loading...</p>;
  // if (error1) return <p>Error :(</p>;
  return (
    <>
      {
        <Paper>
          <DocumentAndSubmit
            componentsId={"leadEngineersPage"}
            document={leadEngineersJson}
            reRender={() => setReRender(!reRender)}
            data={data}
            getQueryBy={itemsId}
            descriptionsId={descriptionsId}
            itemsId={itemsId}
            different={different}
          />
        </Paper>
      }
    </>
  );
};
