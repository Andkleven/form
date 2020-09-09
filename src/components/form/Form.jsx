import React, {
  useState,
  createContext,
  useCallback,
  useRef,
  useEffect
} from "react";
import Chapters from "./components/Chapters";
import query from "graphql/query";
import mutations from "graphql/mutation";
import objectPath from "object-path";
import { Form } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Title from "components/design/fonts/Title";
import { stringifyQuery, isStringInstance } from "functions/general";
import FindNextStage from "components/form/stage/findNextStage.ts";
import { RouteGuard } from "components/Dialog";
import Loading from "components/Loading";

const cloneDeep = require("clone-deep");

function useStore(init = {}) {
  const state = useRef(init);
  const renderFunction = useRef({});
  const resetState = useRef({});
  const screenshotData = useRef(false);
  const reducer = action => {
    switch (action.type) {
      case "setState":
        screenshotData.current = false;
        state.current = cloneDeep(action.newState);
        if (!action.notReRender) {
          Object.values(resetState.current).forEach(func => {
            func();
          });
        }
        break;
      case "add":
        objectPath.set(
          state.current,
          action.fieldName ? `${action.path}.${action.fieldName}` : action.path,
          action.newState
        );
        break;
      case "delete":
        objectPath.del(state.current, action.path);
        break;
      default:
        throw new Error();
    }
    if (action.resetRenderFunction) {
      renderFunction.current = {};
    }
    if (!action.notReRender) {
      Object.values(renderFunction.current).forEach(func => {
        func();
      });
    }
    return state.current;
  };
  return [state, reducer, renderFunction, resetState, screenshotData];
}
function useMathStore(init = {}) {
  const state = useRef(init);
  const reducer = action => {
    objectPath.set(
      state.current,
      action.fieldName ? `${action.path}.${action.fieldName}` : action.path,
      action.newState
    );
    return state.current;
  };
  return [state, reducer];
}

export const ChapterContext = createContext();
export const DocumentDataContext = createContext();

export default ({
  saveVariables = false,
  edit = true,
  readOnlySheet = false,
  document,
  allData,
  data,
  getQueryBy,
  repeatStepList,
  notEditButton,
  jsonVariables,
  chapterAlwaysInWrite,
  backButton,
  stageType,
  specData,
  saveButton,
  stage,
  optionsQuery,
  firstQueryPath,
  secondQueryPath,
  updateBatchingCache,
  update,
  reRender,
  addValuesToData,
  removeEmptyField,
  batchingListIds
}) => {
  const [loading, setLoading] = useState(true);
  const timer = useRef();
  const [editChapter, setEditChapter] = useState(0);
  const [
    documentData,
    documentDataDispatch,
    renderFunction,
    resetState,
    screenshotData
  ] = useStore();
  const [mathStore, mathDispatch] = useMathStore();
  const [when, setWhen] = useState(false);
  const nextStage = useRef(true);
  const renderMath = useRef({});
  const lastData = useRef(false);
  const stagePath = useRef(false);
  const finalChapter = useRef(0);
  const saveVariablesForm = useRef(saveVariables ? saveVariables : {});
  const repeatStepListLocal = useRef(0);

  console.log(data);

  useEffect(() => {
    saveVariablesForm.current = saveVariables ? saveVariables : {};
  }, [saveVariablesForm, saveVariables]);

  const { data: optionsData } = useQuery(
    document.optionsQuery ? query[document.optionsQuery] : query["DEFAULT"],
    {
      variables: {},
      skip: !optionsQuery
    }
  );

  useEffect(() => {
    if (repeatStepListLocal.current !== repeatStepList) {
      finalChapter.current = 0;
    }
    repeatStepListLocal.current = repeatStepList;
  }, [repeatStepList]);

  if (
    data &&
    (JSON.stringify(data) !== JSON.stringify(lastData.current) ||
      !lastData.current)
  ) {
    finalChapter.current = 0;
    lastData.current = cloneDeep(data);
    documentDataDispatch({
      type: "setState",
      newState: data
    });
  }

  const updateCache = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[document.query],
      variables: { id: getQueryBy }
    });
    let array = objectPath.get(oldData, document.queryPath);
    let index = array.findIndex(
      x => x.id === data[document.queryPath.split(/[.]+/).pop()].new.id
    );
    objectPath.set(
      oldData,
      `${document.queryPath}.${index}`,
      data[document.queryPath.split(/[.]+/).pop()].new
    );
    let saveData = document.queryPath.split(/[.]+/).splice(0, 1)[0];
    cache.writeQuery({
      query: query[document.query],
      variables: { id: getQueryBy },
      data: { [saveData]: oldData[saveData] }
    });
  };

  const updateWithVariable = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[document.query],
      variables: { id: getQueryBy }
    });
    let secondQueryPath = "";
    let newData = data[firstQueryPath.split(/[.]+/).pop()];
    if (secondQueryPath.trim()) {
      newData = data[secondQueryPath.split(/[.]+/).pop()];
      secondQueryPath = `.${repeatStepList}.${secondQueryPath}`;
    }
    let array = objectPath.get(oldData, [firstQueryPath] + secondQueryPath);
    let index = 0;
    if (secondQueryPath.trim()) {
      index = array.findIndex(x => x.id === newData.new.id);
    } else {
      index = array.findIndex(x => x.id === newData.new.id);
    }
    objectPath.set(
      oldData,
      `${firstQueryPath}${secondQueryPath}.${index}`,
      newData.new
    );
    let saveData = firstQueryPath.split(/[.]+/).splice(0, 1)[0];

    cache.writeQuery({
      query: query[document.query],
      variables: { id: getQueryBy },
      data: { [saveData]: oldData[saveData] }
    });
  };

  const create = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[document.query],
      variables: { id: getQueryBy }
    });
    objectPath.push(
      oldData,
      document.queryPath,
      data[document.queryPath.split(/[.]+/).pop()].new
    );
    let saveData = document.queryPath.split(/[.]+/).splice(0, 1)[0];
    cache.writeQuery({
      query: query[document.query],
      variables: { id: getQueryBy },
      data: { [saveData]: oldData[saveData] }
    });
  };

  const createWithVariable = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[document.query],
      variables: { id: getQueryBy }
    });
    objectPath.push(
      oldData,
      `${firstQueryPath}.${repeatStepList}.${secondQueryPath}`,
      data[secondQueryPath.split(/[.]+/).pop()].new
    );
    let saveData = firstQueryPath.split(/[.]+/).splice(0, 1)[0];
    cache.writeQuery({
      query: document.query,
      variables: { id: getQueryBy },
      data: { [saveData]: oldData[saveData] }
    });
  };

  const [mutation, { loadingMutation, error: errorMutation }] = useMutation(
    mutations[document.mutation],
    {
      update: updateBatchingCache
        ? updateBatchingCache
        : update
        ? firstQueryPath
          ? updateWithVariable
          : updateCache
        : !data ||
          !data[Object.keys(data)[0]] ||
          !data[Object.keys(data)[0]].length
        ? firstQueryPath
          ? createWithVariable
          : create
        : firstQueryPath
        ? updateWithVariable
        : updateCache,
      onError: () => {},
      onCompleted: reRender
    }
  );

  const submitData = useCallback(
    (data, submit) => {
      renderFunction.current = {};
      screenshotData.current = false;
      setWhen(false);
      setEditChapter(0);
      finalChapter.current = 0;
      setLoading(true);
      if (data) {
        if (submit && !stage && stagePath && !editChapter) {
          objectPath.set(data, stagePath.current, true);
        }
        if (addValuesToData) {
          Object.keys(addValuesToData).forEach(key => {
            objectPath.set(data, key, addValuesToData[key]);
          });
        }
        let variables = stringifyQuery(cloneDeep(data), removeEmptyField);
        mutation({
          variables: {
            ...variables,
            ...saveVariablesForm.current,
            itemIdList: batchingListIds ? batchingListIds : undefined,
            stage:
              isStringInstance(stage) &&
              submit &&
              nextStage.current &&
              !editChapter
                ? FindNextStage(specData, stage, stageType)["stage"]
                : stage
          }
        });
      }
    },
    [
      setWhen,
      screenshotData,
      removeEmptyField,
      stagePath,
      editChapter,
      mutation,
      addValuesToData,
      nextStage,
      batchingListIds,
      stageType,
      specData,
      stage,
      saveVariablesForm,
      renderFunction
    ]
  );

  const formSubmit = e => {
    e.persist();
    e.preventDefault();
    submitData(documentData.current, true);
  };

  const formRef = useRef();
  const save = () => {
    formRef.current.dispatchEvent(new Event("submit", { cancelable: true }));
  };

  timer.current = setTimeout(() => {
    setLoading(false);
  }, 1000);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
      setLoading(true);
    };
  }, [timer, setLoading]);

  if (data) {
    return (
      <DocumentDataContext.Provider
        value={{
          documentData,
          documentDataDispatch,
          renderFunction,
          resetState,
          save,
          mathStore,
          mathDispatch,
          renderMath,
          screenshotData
        }}
      >
        <ChapterContext.Provider
          value={{
            finalChapter,
            editChapter,
            setEditChapter
          }}
        >
          {loading && <Loading />}
          <Title>{document.documentTitle}</Title>
          <Form
            ref={formRef}
            onSubmit={e => {
              formSubmit(e);
            }}
            onChange={() => {
              setWhen(
                screenshotData.current &&
                  JSON.stringify(screenshotData.current) !==
                    JSON.stringify(documentData.current)
              );
            }}
          >
            <RouteGuard
              // TODO: Make `when` true when data is unsaved
              when={when}
              buttons={[
                {
                  label: "Save and continue",
                  variant: "info",
                  type: "submit",
                  onClick: () => {
                    save();
                    return true;
                  }
                },
                {
                  label: "Discard and continue",
                  variant: "danger",
                  onClick: () => {
                    return true;
                  }
                }
              ]}
            />
            <Chapters
              jsonVariables={jsonVariables}
              chapterAlwaysInWrite={chapterAlwaysInWrite}
              stage={stage}
              notEditButton={notEditButton}
              repeatStepList={repeatStepListLocal.current}
              backButton={backButton}
              document={document}
              stageType={stageType}
              specData={specData}
              saveButton={saveButton}
              allData={allData}
              backendData={data}
              optionsData={optionsData}
              submitData={submitData}
              nextStage={nextStage}
              stagePath={stagePath}
              edit={edit}
              readOnlySheet={readOnlySheet}
            />
            {loadingMutation && <Loading />}
            {errorMutation && (
              <div className="text-light w-100">
                <div className="bg-secondary p-2 rounded mb-1 shadow border">
                  {errorMutation && <>{`${errorMutation}`}</>}
                </div>
              </div>
            )}
          </Form>
        </ChapterContext.Provider>
      </DocumentDataContext.Provider>
    );
  } else {
    return null;
  }
};
