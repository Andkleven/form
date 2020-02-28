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

export default pageInfo => {
  let { _id } = pageInfo.match.params;
  const [counter, setCounter] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [reRender, setReRender] = useState(false);
  const [geometryData, setGeometryData] = useState(0);
  const [projectsData, setProjectData] = useState(0);
  const setstate = counter => {
    setCounter(counter);
  };
  const { loading, error, data } = useQuery(query[itemsJson.query], {
    variables: { id: _id }
  });

  useEffect(() => {
    if (!error && !loading) {
      if (
        data.projects[0].descriptions[counter - 1] &&
        data.projects[0].descriptions[counter - 1].items
      ) {
        setGeometryData(data.projects[0].descriptions[counter - 1]);
      } else {
        setGeometryData(0);
      }
      setProjectData(JSON.parse(data.projects[0].data.replace(/'/g, '"')));
      let countNumberOfItems = 0;
      data.projects[0].descriptions.forEach(description => {
        // console.log(items, "item");
        countNumberOfItems += description.items.length;
        // console.log(countNumberOfItems, "count");
      });
      setNumberOfItems(countNumberOfItems);
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
  ] = useMutation(mutations["LEADENGINEERDONE"], { update });

  const [deleteItem] = useMutation(mutations["DELETEITEM"], {
    update: deleteFromCache
  });
  const [
    mutationDiffreant,
    { loading: loadingMutation, error: errorMutation }
  ] = useMutation(mutations["ITEM"]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Paper>
      <DocumentAndSubmit
        componentsId={"itemsPage" + counter.toString()}
        // buttonToEveryForm={true}
        // notEditButton={true}
        // allWaysShow={true}
        document={itemsJson}
        reRender={() => setReRender(!reRender)}
        data={data}
        arrayIndex={counter - 1}
        getQueryBy={_id}
        foreignKey={_id}
      />
      {geometryData && geometryData.items && geometryData.items.length ? (
        <>
          <br />
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
          <ItemList
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
                `/order/lead-engineer/${geometryData.id}/${items.id}/1`
              );
            }}
            submitDelete={id => {
              deleteItem({ variables: { id: id } });
            }}
          />
        </>
      ) : null}

      <h4>
        Geometry {counter}/{projectsData.numberOfDescriptions}
      </h4>
      {counter !== 1 && (
        <Button onClick={() => setstate(counter - 1)}>Back</Button>
      )}
      {counter < projectsData.numberOfDescriptions ? (
        <Button onClick={() => setstate(counter + 1)}>Next</Button>
      ) : (
        numberOfItems == projectsData.totalNumberOfItems &&
        (data.projects[0].leadEngineerDone ? (
          <h3>In Production</h3>
        ) : (
          <Button
            onClick={() =>
              LeadEngineerDoneMutation({
                variables: {
                  project: [{ id: _id, leadEngineerDone: true }]
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
