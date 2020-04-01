import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import history from "../history";
import query from "../request/leadEngineer/Query";
import objectPath from "object-path";
import itemsJson from "../forms/Item.json";
import mutations from "../request/leadEngineer/MutationToDatabase";
import ItemList from "components/item/ItemList";
import DocumentAndSubmit from "components/DocumentAndSubmit";
import Paper from "components/Paper";
import { Button } from "react-bootstrap";
import { objectifyQuery } from "components/Functions";
import ItemUpdate from "components/../page/ItemUpdate";

export default props => {
  const [_id, set_id] = useState(Number(props.id));
  const [counter, setCounter] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [reRender, setReRender] = useState(false);
  const [geometryData, setGeometryData] = useState(0);
  const [projectsData, setProjectData] = useState(0);
  const [fixedData, setFixedData] = useState(null);

  const setstate = counter => {
    setCounter(counter);
  };
  const { loading, error, data } = useQuery(query[itemsJson.query], {
    variables: { id: _id }
  });

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
    oldData.projects[0].descriptions[
      counter - 1
    ].items = oldData.projects[0].descriptions[counter - 1].items.filter(
      item => item.id != deletet
    );
    cache.writeQuery({
      query: query["GET_ORDER_GEOMETRY"],
      variables: { id: _id },
      data: {
        projects: oldData.projects
      }
    });
  };
  const update = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[itemsJson.query],
      variables: { id: _id }
    });
    let array = objectPath.get(oldData, itemsJson.queryPath);
    let index = array.findIndex(
      x => x.id === data[itemsJson.queryPath.split(/[.]+/).pop()].new.id
    );
    objectPath.set(
      oldData,
      `${itemsJson.queryPath}.${index}`,
      data[itemsJson.queryPath.split(/[.]+/).pop()].new
    );
    let saveData = itemsJson.queryPath.split(/[.]+/).splice(0, 1)[0];
    cache.writeQuery({
      query: query[itemsJson.query],
      variables: { id: itemsJson.getQueryBy },
      data: { [saveData]: oldData[saveData] }
    });
  };
  const [
    LeadEngineerDoneMutation,
    { loading: loadingLeadEngineerDone, error: errorLeadEngineerDone }
  ] = useMutation(mutations["ORDER"], { update });

  const [
    deleteItem,
    { loading: loadingDelete, error: errorDelete }
  ] = useMutation(mutations["DELETEITEM"], {
    update: deleteFromCache
  });
  const [
    mutationDiffreant,
    { loading: loadingMutation, error: errorMutation }
  ] = useMutation(mutations["ITEM"]);

  useEffect(() => {
    setFixedData(objectifyQuery(data));
    if (data && data.projects && data.projects[0] && data.projects[0].id) {
      set_id(data.projects[0].id);
    }
  }, [
    reRender,
    loading,
    error,
    data,
    loadingMutation,
    errorMutation,
    loadingLeadEngineerDone,
    errorLeadEngineerDone,
    loadingDelete,
    errorDelete
  ]);

  useEffect(() => {
    if (
      !error &&
      !loading &&
      fixedData &&
      fixedData.projects &&
      fixedData.projects[0] &&
      fixedData.projects[0].descriptions
    ) {
      if (
        fixedData &&
        fixedData.projects &&
        fixedData.projects[0].descriptions &&
        fixedData.projects[0].descriptions[counter - 1] &&
        fixedData.projects[0].descriptions[counter - 1].items
      ) {
        setGeometryData(fixedData.projects[0].descriptions[counter - 1]);
      } else {
        setGeometryData(0);
      }
      setProjectData(fixedData.projects[0].data);
      let countNumberOfItems = 0;
      fixedData.projects[0].descriptions.forEach(description => {
        countNumberOfItems += description.items.length;
      });
      setNumberOfItems(countNumberOfItems);
    }
  }, [counter, fixedData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <Paper>
      <DocumentAndSubmit
        componentsId={"itemsPage" + counter.toString()}
        document={itemsJson}
        reRender={() => setReRender(!reRender)}
        data={fixedData}
        arrayIndex={[counter - 1]}
        getQueryBy={_id}
        foreignKey={_id}
      />
      {geometryData && geometryData.items && geometryData.items.length ? (
        <>
          <br />
          <ItemUpdate
            foreignKey={geometryData.id}
            getQueryBy={_id}
            counter={counter - 1}
          />
          <br />
          <Button
            onClick={() =>
              history.push(
                `/order/lead-engineer/${geometryData.id}/${
                  geometryData.items.find(item => item.different === false).id
                }/0`
              )
            }
          >
            Create all items
          </Button>
          <h3> Number of items: {geometryData.items.length}</h3>
          <ItemList
            getQueryBy={_id}
            counter={counter - 1}
            items={geometryData.items}
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
      {fixedData && fixedData.projects && fixedData.projects[0] ? (
        <h4>
          Geometry {counter}/{projectsData.numberOfDescriptions}
        </h4>
      ) : null}
      {counter !== 1 && (
        <Button onClick={() => setstate(counter - 1)}>Back</Button>
      )}
      {counter < projectsData.numberOfDescriptions ? (
        <Button onClick={() => setstate(counter + 1)}>Next</Button>
      ) : (
        numberOfItems == projectsData.totalNumberOfItems &&
        (fixedData.projects[0].leadEngineerDone ? (
          <h3>In Production</h3>
        ) : (
          <Button
            onClick={() =>
              LeadEngineerDoneMutation({
                variables: {
                  projects: [{ id: _id, leadEngineerDone: true }]
                }
              })
            }
          >
            Send to Production
          </Button>
        ))
      )}

      {loadingMutation && <p>Loading...</p>}
      {errorMutation && <p>Error :( Please try again</p>}
      {loadingLeadEngineerDone && <p>Loading...</p>}
      {errorLeadEngineerDone && <p>Error :( Please try again</p>}
    </Paper>
  );
};
