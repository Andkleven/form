import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import history from "functions/history";
import query from "graphql/query";
import objectPath from "object-path";
import mutations from "graphql/mutation";
import ItemList from "components/item/ItemList";
import Form from "components/form/Form";
import Paper from "components/layout/Paper";
import {
  objectifyQuery,
  stringifyQuery,
  getStartStage,
  productionLineJson
} from "functions/general";
import ItemUpdate from "components/item/ItemUpdate";
import { useParams } from "react-router-dom";
import Canvas from "components/layout/Canvas";
import DepthButton from "components/button/DepthButton";
import ReadField from "components/form/components/fields/ReadField";
import DepthButtonGroup from "components/button/DepthButtonGroup";
import coatingCreateProject from "templates/coating/coatingCreateProject.json";
import packerCreateProject from "templates/packer/packerCreateProject.json";
import Loading from "components/Loading";
const cloneDeep = require("clone-deep");

export default () => {
  const { id, productionLine } = useParams();
  const [_id, set_id] = useState(Number(id));
  const [counter, setCounter] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [reRender, setReRender] = useState(false);
  const [geometryData, setGeometryData] = useState(0);
  const [projectsData, setProjectData] = useState(0);
  const [fixedData, setFixedData] = useState(null);

  const createProjectJson = productionLineJson(
    productionLine,
    coatingCreateProject,
    packerCreateProject
  );

  const setState = counter => {
    setCounter(counter);
  };
  const { loading, error, data } = useQuery(query[createProjectJson.query], {
    variables: { id: _id }
  });

  const dosePathExist = useCallback(
    path => {
      return !!(fixedData && objectPath.get(fixedData, path));
    },
    [fixedData]
  );

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
      query: query[createProjectJson.query],
      variables: { id: _id }
    });
    let array = objectPath.get(oldData, createProjectJson.queryPath);
    let index = array.findIndex(
      x => x.id === data[createProjectJson.queryPath.split(/[.]+/).pop()].new.id
    );
    objectPath.set(
      oldData,
      `${createProjectJson.queryPath}.${index}`,
      data[createProjectJson.queryPath.split(/[.]+/).pop()].new
    );
    let saveData = createProjectJson.queryPath.split(/[.]+/).splice(0, 1)[0];
    cache.writeQuery({
      query: query[createProjectJson.query],
      variables: { id: createProjectJson.getQueryBy },
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

  useEffect(() => {
    setFixedData(objectifyQuery(data));
    if (data && objectPath.get("projects.0.id", data)) {
      set_id(data.projects[0].id);
    }
  }, [
    reRender,
    loading,
    error,
    data,
    loadingLeadEngineerDone,
    errorLeadEngineerDone,
    loadingDelete,
    errorDelete
  ]);

  const projectExists = dosePathExist("projects.0");

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
    } else {
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

  const setInitialStages = data => {
    data.projects.forEach((project, projectIndex) => {
      project.descriptions.forEach((description, descriptionIndex) => {
        description.items.forEach((item, itemIndex) => {
          let stage = getStartStage(description.data.geometry, item);
          data["projects"][projectIndex]["descriptions"][descriptionIndex][
            "items"
          ][itemIndex]["stage"] = stage;
        });
      });
    });
  };

  const itemsDone = data => {
    let done = true;
    data.projects.forEach(project => {
      project.descriptions.forEach(description => {
        description.items.forEach(item => {
          if (item.leadEngineers && item.leadEngineers.length === 0) {
            done = false;
          }
        });
      });
    });
    return done;
  };

  const onlyUnique = () => {
    let onlyUnique = true;
    data.projects.forEach(project => {
      project.descriptions.forEach(description => {
        description.items.forEach(item => {
          if (!item.unique) {
            onlyUnique = false;
          }
        });
      });
    });
    return onlyUnique;
  };

  const sent = dosePathExist("projects.0.leadEngineerDone");

  const sendable =
    projectExists &&
    !sent &&
    fixedData.projects[0].descriptions.length ===
      projectsData.numberOfDescriptions &&
    Number(numberOfItems) === Number(projectsData.totalNumberOfItems) &&
    itemsDone(data);

  useEffect(() => {
    if (!error && !loading && dosePathExist("projects.0.descriptions")) {
      if (dosePathExist(`projects.0.descriptions.${counter - 1}.items`)) {
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
  }, [counter, fixedData, error, loading, dosePathExist]);

  if (loading) return <Loading />;
  if (error) return <p>Error :(</p>;

  return (
    <Canvas showForm={data}>
      <Paper>
        <Form
          componentsId={"itemsPage" + counter.toString()}
          document={createProjectJson}
          reRender={() => setReRender(!reRender)}
          data={fixedData}
          repeatStepList={[counter - 1]}
          getQueryBy={_id}
          optionsQuery={true}
          addValuesToData={{ "projects.0.productionLine": productionLine }}
        />
        {geometryData && geometryData.items && geometryData.items.length ? (
          <>
            <ItemUpdate
              foreignKey={geometryData.id}
              getQueryBy={_id}
              counter={counter - 1}
              geometry={geometryData.data.geometry}
              setStage={fixedData["projects"][0]["leadEngineerDone"]}
            />
            {projectExists && <ItemCounter className="my-3" />}
            <DepthButton
              iconProps={{
                icon: ["fas", "cubes"],
                size: "lg"
                // className: "text-secondary"
              }}
              className="text-center w-100 mt-3"
              onClick={() =>
                history.push(
                  `/lead-engineer/${_id}/${geometryData.id}/${
                    geometryData.items.find(item => item.unique === false).id
                  }/0/${geometryData.data.geometry}/${productionLine}`
                )
              }
              style={{ marginBottom: 2 }}
              disabled={onlyUnique()}
            >
              {onlyUnique() ? "All items unique" : "Open all homogenous items"}
            </DepthButton>
            <ItemList
              className="pt-1"
              getQueryBy={_id}
              counter={counter - 1}
              items={geometryData.items}
              submitItem={item => {
                history.push(
                  `/lead-engineer/${_id}/${geometryData.id}/${item.id}/1/${geometryData.data.geometry}/${productionLine}`
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
              geometry={geometryData.data.geometry}
              setStage={fixedData["projects"][0]["leadEngineerDone"]}
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
              iconProps={{
                icon: ["fas", `${sent ? "thumbs-up" : "share"}`],
                className: "text-primary"
              }}
              className="text-center w-100 mt-1"
              onClick={() => {
                let newData = cloneDeep(fixedData);
                setInitialStages(newData);
                newData["projects"][0]["leadEngineerDone"] = true;
                stringifyQuery(newData);
                LeadEngineerDoneMutation({
                  variables: newData
                });
                history.push("/");
              }}
              disabled={!sendable}
            >
              {sent
                ? "Sent to production"
                : sendable
                ? "Send to production"
                : "Not ready to send"}
            </DepthButton>
          </>
        )}
      </Paper>
    </Canvas>
  );
};
