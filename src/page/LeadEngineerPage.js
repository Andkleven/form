import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import leadEngineerJson from "../forms/LeadEngineer.json";
import Book from "../components/Book";

function LeadEngineerPage(pageInfo) {
  const { categoryId, itemId, different } = pageInfo.match.params;
  const [reRender, setReRender] = useState(false);
  // const { loading1, error1, data: getGategory } = useQuery(query["GET_GEOMETRY"], {
  //   variables: { id: categoryId }
  // });
  const { loading, error, data } = useQuery(query["GET_LEAD_ENGINEER"], {
    variables: { id: itemId }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  // if (loading1) return <p>Loading...</p>;
  // if (error1) return <p>Error :(</p>;
  return (
    <>
      {
        <Book
          componentsId={"leadEngineerPage"}
          json={leadEngineerJson}
          reRender={() => setReRender(!reRender)}
          data={data}
          getQueryBy={itemId}
          categoryId={categoryId}
          itemId={itemId}
          different={different}
        />
      }
    </>
  );
}

export default LeadEngineerPage;
