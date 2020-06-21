import React, {
  useState,
  createContext,
  useLayoutEffect,
  useCallback,
  useRef
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

const cloneDeep = require("clone-deep");

// import whyDidYouRender from "@welldone-software/why-did-you-render";

// whyDidYouRender(React, {
//   onlyLogs: true,
//   titleColor: "green",
//   diffNameColor: "darkturquoise"
// });
function useStore(init) {
  const state = useRef(init);
  const renderFunction = useRef({});
  const reducer = action => {
    switch (action.type) {
      case "setState":
        state.current = cloneDeep(action.newState);
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
    if (!action.notReRender) {
      Object.values(renderFunction.current)
        .reverse()
        .forEach(func => {
          func();
        });
    }
    return state.current;
  };
  return [state, reducer, renderFunction];
}
export const ChapterContext = createContext();
export const DocumentDateContext = createContext();

export default props => {
  const [editChapter, setEditChapter] = useState(0);
  const [documentDate, documentDateDispatch, renderFunction] = useStore({});
  const nextStage = useRef(true);
  // const [nextStage, setNextStage] = useState(true);
  const [lastChapter, setLastChapter] = useState(0);
  const { data: optionsData } = useQuery(
    props.document.optionsQuery
      ? query[props.document.optionsQuery]
      : query["DEFAULT"],
    {
      variables: {},
      skip: !props.optionsQuery
    }
  );
  // Set DocumentDate to empty dictionary if a new component calls Form
  useLayoutEffect(() => {
    if (props.data) {
      documentDateDispatch({
        type: "setState",
        newState: props.data
      });
    }
  }, [props.componentsId, documentDateDispatch, props.data]);
  // console.log(documentDate);
  // console.log(validationPassed)

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
      onCompleted: props.reRender
    }
  );

  const submitData = useCallback(
    (data, submit) => {
      // clearTimeout(timer.current)
      // timer.current = setTimeout(() => {
      setEditChapter(0);
      setLastChapter(0);
      // console.log("nei");
      if (documentDate.current) {
        let variables = stringifyQuery(
          cloneDeep(documentDate.current),
          props.removeEmptyField
        );
        mutation({
          variables: {
            ...variables,
            descriptionId:
              props.sendItemId === 0 ? Number(props.descriptionId) : undefined,
            itemId: props.sendItemId ? Number(props.itemId) : undefined,
            itemIdList: props.batchingListIds
              ? props.batchingListIds
              : undefined,
            stage:
              isStringInstance(props.stage) &&
              submit &&
              nextStage.current &&
              !editChapter
                ? FindNextStage(props.specData, props.stage, props.geometry)
                : props.stage
          }
        });
      }
      // }, delayOnHandler)
    },
    [
      props.removeEmptyField,
      documentDate,
      editChapter,
      mutation,
      nextStage,
      props.batchingListIds,
      props.descriptionId,
      props.geometry,
      props.itemId,
      props.sendItemId,
      props.specData,
      props.stage
    ]
  );

  const formSubmit = e => {
    e.persist();
    e.preventDefault();
    submitData(documentDate.current, true);
  };

  return (
    <DocumentDateContext.Provider
      value={{ documentDate, documentDateDispatch, renderFunction }}
    >
      <ChapterContext.Provider
        value={{
          lastChapter,
          setLastChapter,
          editChapter,
          setEditChapter
        }}
      >
        <Title>{props.document.documentTitle}</Title>
        <Form
          onSubmit={e => {
            formSubmit(e);
          }}
        >
          <Chapters
            {...props}
            backendData={props.data}
            optionsData={optionsData}
            submitData={submitData}
            nextStage={nextStage}
          />
          {loadingMutation && <p>Loading...</p>}
          {errorMutation && <p>Error :( Please try again</p>}
        </Form>
      </ChapterContext.Provider>
    </DocumentDateContext.Provider>
  );
};
// Form.whyDidYouRender = true;
