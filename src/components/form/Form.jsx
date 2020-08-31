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
  const reducer = action => {
    switch (action.type) {
      case "setState":
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
      renderFunction.current = {}
    }
    if (!action.notReRender) {
      Object.values(renderFunction.current)
        .forEach(func => {
          func();
        });
    }
    return state.current;
  };
  return [state, reducer, renderFunction, resetState];
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
  }
  return [state, reducer];
};

export const ChapterContext = createContext();
export const DocumentDataContext = createContext();

export default ({ saveVariables = {}, ...props }) => {

  const [loading, setLoading] = useState(true)
  const timer = useRef()
  const [editChapter, setEditChapter] = useState(0);
  const [
    documentData,
    documentDataDispatch,
    renderFunction,
    resetState
  ] = useStore();
  const [mathStore, mathDispatch] = useMathStore();
  const nextStage = useRef(true);
  const renderMath = useRef({});
  const lastData = useRef(false);
  const stagePath = useRef(false);
  const finalChapter = useRef(0);




  const { data: optionsData } = useQuery(
    props.document.optionsQuery
      ? query[props.document.optionsQuery]
      : query["DEFAULT"],
    {
      variables: {},
      skip: !props.optionsQuery
    }
  );

  if (
    props.data &&
    (JSON.stringify(props.data) !== JSON.stringify(lastData.current) ||
      !lastData.current)
  ) {
    finalChapter.current = 0;
    lastData.current = cloneDeep(props.data);
    documentDataDispatch({
      type: "setState",
      newState: props.data,
      notReRender: true
    });
  }

  const update = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[props.document.query],
      variables: { id: props.getQueryBy }
    });
    let array = objectPath.get(oldData, props.document.queryPath);
    let index = array.findIndex(
      x => x.id === data[props.document.queryPath.split(/[.]+/).pop()].new.id
    );
    objectPath.set(
      oldData,
      `${props.document.queryPath}.${index}`,
      data[props.document.queryPath.split(/[.]+/).pop()].new
    );
    let saveData = props.document.queryPath.split(/[.]+/).splice(0, 1)[0];
    cache.writeQuery({
      query: query[props.document.query],
      variables: { id: props.getQueryBy },
      data: { [saveData]: oldData[saveData] }
    });
  };

  const updateWithVariable = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[props.document.query],
      variables: { id: props.getQueryBy }
    });
    let secondQueryPath = "";
    let newData = data[props.firstQueryPath.split(/[.]+/).pop()];
    if (props.secondQueryPath.trim()) {
      newData = data[props.secondQueryPath.split(/[.]+/).pop()];
      secondQueryPath = `.${props.repeatStepList}.${props.secondQueryPath}`;
    }
    let array = objectPath.get(
      oldData,
      [props.firstQueryPath] + secondQueryPath
    );
    let index = 0;
    if (props.secondQueryPath.trim()) {
      index = array.findIndex(x => x.id === newData.new.id);
    } else {
      index = array.findIndex(x => x.id === newData.new.id);
    }
    objectPath.set(
      oldData,
      `${props.firstQueryPath}${secondQueryPath}.${index}`,
      newData.new
    );
    let saveData = props.firstQueryPath.split(/[.]+/).splice(0, 1)[0];

    cache.writeQuery({
      query: query[props.document.query],
      variables: { id: props.getQueryBy },
      data: { [saveData]: oldData[saveData] }
    });
  };

  const create = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[props.document.query],
      variables: { id: props.getQueryBy }
    });
    objectPath.push(
      oldData,
      props.document.queryPath,
      data[props.document.queryPath.split(/[.]+/).pop()].new
    );
    let saveData = props.document.queryPath.split(/[.]+/).splice(0, 1)[0];
    cache.writeQuery({
      query: query[props.document.query],
      variables: { id: props.getQueryBy },
      data: { [saveData]: oldData[saveData] }
    });
  };

  const createWithVariable = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[props.document.query],
      variables: { id: props.getQueryBy }
    });
    objectPath.push(
      oldData,
      `${props.firstQueryPath}.${props.repeatStepList}.${props.secondQueryPath}`,
      data[props.secondQueryPath.split(/[.]+/).pop()].new
    );
    let saveData = props.firstQueryPath.split(/[.]+/).splice(0, 1)[0];
    cache.writeQuery({
      query: props.document.query,
      variables: { id: props.getQueryBy },
      data: { [saveData]: oldData[saveData] }
    });
  };

  const [mutation, { loadingMutation, error: errorMutation }] = useMutation(
    mutations[props.document.mutation],
    {
      update: props.updateCache
        ? props.updateCache
        : !props.data ||
          !props.data[Object.keys(props.data)[0]] ||
          !props.data[Object.keys(props.data)[0]].length
          ? props.firstQueryPath
            ? createWithVariable
            : create
          : props.firstQueryPath
            ? updateWithVariable
            : update,
      onError: () => { },
      onCompleted: props.reRender
    }
  );

  const submitData = useCallback(
    (data, submit) => {
      renderFunction.current = {}
      setEditChapter(0);
      setLoading(true)
      if (documentData.current) {
        if (submit && !props.stage && stagePath && !editChapter) {
          objectPath.set(documentData.current, stagePath.current, true)
        }
        if (props.addValuesToData) {
          Object.keys(props.addValuesToData).forEach(key => {
            objectPath.set(documentData.current, key, props.addValuesToData[key])
          })
        }
        let variables = stringifyQuery(
          cloneDeep(documentData.current),
          props.removeEmptyField
        );
        mutation({
          variables: {
            ...variables,
            ...saveVariables,
            itemIdList: props.batchingListIds
              ? props.batchingListIds
              : undefined,
            stage:
              isStringInstance(props.stage) &&
                submit &&
                nextStage.current &&
                !editChapter
                ? FindNextStage(props.specData, props.stage, props.stageType)[
                "stage"
                ]
                : props.stage
          }
        });
      }
    },
    [
      props.removeEmptyField,
      documentData,
      stagePath,
      editChapter,
      mutation,
      props.addValuesToData,
      nextStage,
      props.batchingListIds,
      props.stageType,
      props.specData,
      props.stage,
      saveVariables,
      renderFunction,
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
    setLoading(false)
  }, 1000)
  useEffect(() => {
    return () => {
      clearTimeout(timer.current)
      setLoading(true)
    }
  }, [timer, setLoading])


  if (props.data) {
    return (
      <DocumentDataContext.Provider
        value={{
          documentData,
          documentDataDispatch,
          renderFunction,
          resetState,
          save,
          submitData,
          mathStore,
          mathDispatch,
          renderMath
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
          <Title>{props.document.documentTitle}</Title>
          <Form
            ref={formRef}
            onSubmit={e => {
              formSubmit(e);
            }}
          >
            <RouteGuard
              // TODO: Make `when` true when data is unsaved
              when={() => (JSON.stringify(props.backendData) !== JSON.stringify(documentData.current))}
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
              {...props}
              backendData={props.data}
              optionsData={optionsData}
              submitData={submitData}
              nextStage={nextStage}
              stagePath={stagePath}
              edit={props.edit === undefined ? true : props.edit}
              readOnlySheet={
                props.readOnlySheet === undefined ? false : props.readOnlySheet
              }
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
