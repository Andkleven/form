import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import history from "functions/history";
import query from "graphql/query";
import objectPath from "object-path";
import itemsJson from "templates/createProject.json";
import mutations from "graphql/mutation";
import ItemList from "components/item/ItemList";
import Form from "components/form/Form";
import Paper from "components/layout/Paper";
import { objectifyQuery } from "functions/general";
import ItemUpdate from "pages/leadEngineer/ItemUpdate";
import Canvas from "components/layout/Canvas";
import DepthButton from "components/button/DepthButton";
import ReadField from "components/form/components/fields/ReadField";
import DepthButtonGroup from "components/button/DepthButtonGroup";
import GeneralButton from "components/button/GeneralButton";

export default pageInfo => {
  const [_id, set_id] = useState(Number(pageInfo.match.params.id));
  const [counter, setCounter] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [reRender, setReRender] = useState(false);
  const [geometryData, setGeometryData] = useState(0);
  const [projectsData, setProjectData] = useState(0);
  const [fixedData, setFixedData] = useState(null);

  const setState = counter => {
    setCounter(counter);
  };
  const { loading, error, data } = useQuery(query[itemsJson.query], {
    variables: { id: _id }
  });
  const deleteFromCache = (
    cache,
    {
      data: {
        itemDelete: { deleted }
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
      /** WARNING: Non-strict comparison below
       * For more info on strict vs non-strict comparisons:
       * https://codeburst.io/javascript-double-equals-vs-triple-equals-61d4ce5a121a
       */
      // eslint-disable-next-line
      item => item.id != deleted
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
  ] = useMutation(mutations["DELETE_ITEM"], {
    update: deleteFromCache
  });

  const [
    mutationUnique,
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
  }, [counter, fixedData, error, loading]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const projectExists =
    fixedData && fixedData.projects && fixedData.projects[0];

  const sendToProduction = fixedData && fixedData.projects && fixedData.projects[0] && fixedData.projects[0].leadEngineerDone


  const ItemCounter = ({ className }) => {
    const percentage = numberOfItems / projectsData.totalNumberOfItems;
    const perfect = percentage === 1.0;
    const over = percentage > 1.0;
    // const under = percentage < 1.0;

    let textColor;

    if (perfect) {
      textColor = "success";
    } else if (over) {
      textColor = "danger";
    }

    textColor = "text-" + textColor;

    return (
      <div className={`${className}`}>
        <ReadField
          display
          label={`Items in current description`}
          value={`${geometryData.items.length}`}
          // noLine
        />
        <ReadField
          display
          className={`${textColor}`}
          label={`Items in project`}
          value={`${numberOfItems}/${projectsData.totalNumberOfItems}${
            over ? ", too many items!" : ""
          }`}
          // noLine
        />
      </div>
    );
  };

  return (
    <Canvas>
      <Paper>
        <Form
          componentsId={"itemsPage" + counter.toString()}
          document={itemsJson}
          reRender={() => setReRender(!reRender)}
          data={fixedData}
          repeatStepList={[counter - 1]}
          getQueryBy={_id}
          foreignKey={_id}
        />
        {geometryData && geometryData.items && geometryData.items.length ? (
          <>
            <ItemUpdate
              foreignKey={geometryData.id}
              getQueryBy={_id}
              counter={counter - 1}
            />
            {projectExists && <ItemCounter className="my-3" />}
            <DepthButton
              iconProps={{
                icon: ["fas", "cubes"],
                size: "lg",
                className: "text-secondary"
              }}
              className="text-center w-100 mt-3"
              onClick={() =>
                history.push(
                  `/lead-engineer/${_id}/${geometryData.id}/${
                    geometryData.items.find(item => item.unique === false).id
                  }/0/${geometryData.data.geometry}`
                )
              }
              style={{ marginBottom: 2 }}
            >
              Open all items
            </DepthButton>
            <ItemList
              className="pt-1"
              getQueryBy={_id}
              counter={counter - 1}
              items={geometryData.items}
              submitItem={item => {
                if (!item.unique) {
                  mutationUnique({
                    variables: {
                      id: item.id,
                      unique: true
                    }
                  });
                }
                history.push(
                  `/lead-engineer/${_id}/${geometryData.id}/${item.id}/1/${geometryData.data.geometry}`
                );
              }}
              submitDelete={id => {
                deleteItem({ variables: { id: id } });
              }}
            />
          </>
        ) : geometryData ? (
          <>
            <ItemUpdate
              foreignKey={geometryData.id}
              getQueryBy={_id}
              counter={counter - 1}
            />
            {projectExists && <ItemCounter className="my-3" />}
          </>
        ) : null}
        {projectExists && (
          <>
            <DepthButtonGroup className="w-100 mt-3 pt-3">
              <DepthButton
                className="text-center w-50"
                iconProps={{ icon: "arrow-to-left" }}
                onClick={() => setState(counter - 1)}
                disabled={counter !== 1 ? false : true}
              >
                <div className="d-none d-sm-inline">Previous</div>
              </DepthButton>
              <DepthButton disabled className="text-center w-100">
                Description {counter}/{projectsData.numberOfDescriptions}
              </DepthButton>
              <DepthButton
                iconProps={{ icon: "arrow-to-right" }}
                iconLast
                className="text-center w-50"
                onClick={() => setState(counter + 1)}
                disabled={
                  counter < projectsData.numberOfDescriptions ? false : true
                }
              >
                <div className="d-none d-sm-inline">Next</div>
              </DepthButton>
            </DepthButtonGroup>
            <DepthButton
              iconProps={{ icon: ["fas", "share"], className: "text-primary" }}
              className="text-center w-100 mt-1"
              onClick={() =>
                LeadEngineerDoneMutation({
                  variables: {
                    projects: [{ id: _id, leadEngineerDone: true }]
                  }
                })
              }
              disabled={
                /** WARNING: Non-strict comparison below
                 * For more info on strict vs non-strict comparisons:
                 * https://codeburst.io/javascript-double-equals-vs-triple-equals-61d4ce5a121a
                 */
                // eslint-disable-next-line
                fixedData.projects[0].descriptions.length !==
                  projectsData.numberOfDescriptions ||
                Number(numberOfItems) !==
                  Number(projectsData.totalNumberOfItems)
              }
            >
              Send to Production
            </DepthButton>
          </>
        )}
        {/* {loadingMutation && <p>Loading...</p>}
        {errorMutation && <p>Error :( Please try again</p>}
        {loadingLeadEngineerDone && <p>Loading...</p>}
        {errorLeadEngineerDone && <p>Error :( Please try again</p>} */}
      </Paper>
    </Canvas>
  );
};
