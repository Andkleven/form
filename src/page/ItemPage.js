import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import ItemList from "../components/item/ItemList";
import history from "../history";
import query from "../request/leadEngineer/Query";
import itemJson from "../forms/Item.json";
import mutations from "../request/leadEngineer/MutationToDatabase";
import DocumentAndSubmit from "../components/DocumentAndSubmit";
import Paper from "components/Paper";

export default pageInfo => {
  let { _id } = pageInfo.match.params;
  const [counter, setCounter] = useState(1);
  const [reRender, setReRender] = useState(false);
  const [geometryData, setGeometryData] = useState(0);
  const [createProjectData, setCreateProjectData] = useState(0);
  const setstate = counter => {
    setCounter(counter);
  };
  const { loading, error, data } = useQuery(query[itemJson.query], {
    variables: { id: _id }
  });
  useEffect(() => {
    if (!error && !loading) {
      if (
        data.createProject[0].category[counter - 1] &&
        data.createProject[0].category[counter - 1].item
      ) {
        setGeometryData(data.createProject[0].category[counter - 1]);
      } else {
        setGeometryData(0);
      }
      setCreateProjectData(
        JSON.parse(data.createProject[0].data.replace(/'/g, '"'))
      );
    }
  }, [data, error, loading, counter, reRender]);
  const deleteFromCache = (
    cache,
    {
      data: {
        itemDelete: { deletet }
      }
    }
  ) => {
    const oldData = cache.readQuery({
      query: query["GET_ORDER_GEOMETRY"],
      variables: { id: _id }
    });
    oldData.createProject[0].category[
      counter - 1
    ].item = oldData.createProject[0].category[counter - 1].item.filter(
      item => item.id != deletet
    );
    cache.writeQuery({
      query: query["GET_ORDER_GEOMETRY"],
      variables: { id: _id },
      data: {
        createProject: oldData.createProject
      }
    });
  };

  const [deleteItem] = useMutation(mutations["DELETEITEM"], {
    update: deleteFromCache
  });
  const [
    mutationDiffreant,
    { loading: loadingMutation, error: errorMutation }
  ] = useMutation(mutations["ITEM"]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  if (loadingMutation) return <p>Loading...</p>;
  if (errorMutation) return <p>Error :(</p>;
  return (
    <Paper>
      <DocumentAndSubmit
        componentsId={"itemPage" + counter.toString()}
        // buttonToEveryForm={true}
        // notEditButton={true}
        // allWaysShow={true}
        document={itemJson}
        reRender={() => setReRender(!reRender)}
        data={data}
        arrayIndex={counter - 1}
        getQueryBy={_id}
        foreignKey={_id}
      />
      {geometryData ? (
        <>
          <button
            onClick={() =>
              history.push(
                `/order/lead-engineer/${geometryData.id}/${
                  geometryData.item.find(item => item.different === false).id
                }/0`
              )
            }
          >
            Create all item
          </button>
          <ItemList
            items={geometryData.item}
            submitItem={item => {
              if (!item.different) {
                mutationDiffreant({
                  variables: {
                    id: item.id,
                    different: true
                  }
                });
              }
              history.push(
                `/order/lead-engineer/${geometryData.id}/${item.id}/1`
              );
            }}
            submitDelete={id => {
              deleteItem({ variables: { id: id } });
            }}
          />
        </>
      ) : null}

      <h4>
        Geometry {counter}/{createProjectData.numberOfCategorys}
      </h4>
      {counter !== 1 && (
        <button onClick={() => setstate(counter - 1)}>Back</button>
      )}
      {counter < createProjectData.numberOfCategorys ? (
        <button onClick={() => setstate(counter + 1)}>Next</button>
      ) : (
        <button>Submit</button>
      )}
      {loadingMutation && <p>Loading...</p>}
      {errorMutation && <p>Error :( Please try again</p>}
    </Paper>
  );
};
