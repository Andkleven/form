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
  resetData = false,
  stages,
  document,
  allData,
  data,
  specRemovePath,
  removePath,
  getQueryBy,
  repeatStepList,
  notEditButton,
  jsonVariables,
  chapterAlwaysInWrite,
  backButton,
  stageType,
  specData,
  stage,
  optionsQuery,
  updateBatchingCache,
  update,
  reRender,
  addValuesToData,
  removeEmptyField,
  itemIdsRef,
  itemId
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
  const repeatStepListLocal = useRef(repeatStepList);

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
      newState: data,
      notReRender: !resetData
    });
  }

  const updateCache = useCallback(
    (cache, { data }) => {
      const oldData = cache.readQuery({
        query: query[document.query],
        variables: { id: getQueryBy }
      });
      let array = objectPath.get(oldData, document.getOldValue);
      let index;
      if (Array.isArray(array)) {
        index = array.findIndex(
          x => x.id === objectPath.get(data, document.getNewValue).id
        );
      } else {
        index = null;
      }
      objectPath.set(
        oldData,
        index === null
          ? `${document.getOldValue}`
          : `${document.getOldValue}.${index}`,
        objectPath.get(data, document.getNewValue)
      );
      cache.writeQuery({
        query: query[document.query],
        variables: { id: getQueryBy },
        data: { ...oldData }
      });
    },
    [document.getNewValue, document.getOldValue, document.query, getQueryBy]
  );

  const create = useCallback(
    (cache, { data }) => {
      const oldData = cache.readQuery({
        query: query[document.query],
        variables: { id: getQueryBy }
      });
      objectPath.push(
        oldData,
        document.getOldValue,
        objectPath.get(data, document.getNewValue)
      );
      cache.writeQuery({
        query: query[document.query],
        variables: { id: getQueryBy },
        data: { ...oldData }
      });
    },
    [document.getNewValue, document.getOldValue, document.query, getQueryBy]
  );

  const [mutation, { loadingMutation, error: errorMutation }] = useMutation(
    mutations[document.mutation],
    {
      update: updateBatchingCache
        ? updateBatchingCache
        : update
        ? updateCache
        : !data ||
          !data[Object.keys(data)[0]] ||
          !data[Object.keys(data)[0]].length
        ? create
        : updateCache,
      onError: () => {},
      onCompleted: reRender
    }
  );
  const submitData = useCallback(
    submit => {
      renderFunction.current = {};
      screenshotData.current = false;
      setWhen(false);
      setEditChapter(0);
      finalChapter.current = 0;
      setLoading(true);
      if (documentData.current) {
        if (submit && !stage && stagePath && !editChapter) {
          objectPath.set(documentData.current, stagePath.current, true);
        }
        if (addValuesToData) {
          Object.keys(addValuesToData).forEach(key => {
            objectPath.set(documentData.current, key, addValuesToData[key]);
          });
        }
        let variables = stringifyQuery(
          cloneDeep(documentData.current),
          removeEmptyField
        );
        mutation({
          variables: {
            ...variables,
            ...saveVariablesForm.current,
            stages:
              stages && submit && nextStage.current && !editChapter
                ? stages
                : undefined,
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
      documentData,
      stages,
      setWhen,
      screenshotData,
      removeEmptyField,
      stagePath,
      editChapter,
      mutation,
      addValuesToData,
      nextStage,
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
              removePath={removePath}
              notEditButton={notEditButton}
              repeatStepList={repeatStepListLocal.current}
              backButton={backButton}
              document={document}
              stageType={stageType}
              specData={specData}
              allData={allData}
              backendData={data}
              optionsData={optionsData}
              submitData={submitData}
              stagePath={stagePath}
              edit={edit}
              readOnlySheet={readOnlySheet}
              itemIdsRef={itemIdsRef}
              itemId={itemId}
              specRemovePath={specRemovePath}
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
