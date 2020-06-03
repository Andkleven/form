import React, {
  useState,
  createContext,
  useLayoutEffect,
  useReducer
} from "react";
import Chapters from "./components/Chapters";
import query from "graphql/query";
import mutations from "graphql/mutation";
import objectPath from "object-path";
import SubmitButton from "components/button/SubmitButton";
import { Form } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Title from "components/design/fonts/Title";
import {
  stringifyQuery
} from "functions/general";

import FindNextStage from "components/form/stage/findNextStage";

// import whyDidYouRender from "@welldone-software/why-did-you-render";

// whyDidYouRender(React, {
//   onlyLogs: true,
//   titleColor: "green",
//   diffNameColor: "darkturquoise"
// });

function reducer(state, action) {
  switch (action.type) {
    case "setState":
      return {...cloneDeep(action.newState)};
    case "add":
      objectPath.set(
        state,
        action.fieldName ? `${action.path}.${action.fieldName}` : action.path,
        action.newState
      );
      return {...state};
    case "delete":
      objectPath.del(state, action.path);
      return {...state}
    default:
      throw new Error();
  }
}

export const ChapterContext = createContext();
export const DocumentDateContext = createContext();

const cloneDeep = require("clone-deep");

export default props => {
  const [editChapter, setEditChapter] = useState(0);
  const [documentDate, documentDateDispatch] = useReducer(reducer, {});
  const [nextStage, setNextStage] = useState(true);
  const [lastChapter, setLastChapter] = useState(0);

  const { data: optionsData } = useQuery(
    props.document.optionsQuery
      ? query[props.document.optionsQuery]
      : query["DEFAULT"],
    {
      variables: {},
      skip: props.optionsQuery
    }
  );

  // Set DocumentDate to empty dictionary if a new components calls Form
  useLayoutEffect(() => {
    if (props.data) {
      documentDateDispatch({
        type: "setState",
        newState: props.data
      });
    }
  }, [props.componentsId, props.data]);
  console.log(documentDate)
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
  const submitData = (data, submit) => {
    setNextStage(true);
    setEditChapter(0)
    setLastChapter(0)

    if (data) {
      let variables = stringifyQuery(cloneDeep(data));
      mutation({
        variables: {
          ...variables,
          descriptionId:
            props.sendItemId === 0 ? Number(props.descriptionId) : undefined,
          itemId: props.sendItemId ? Number(props.itemId) : undefined,
          itemIdList: props.batchingListIds ? props.batchingListIds : undefined,
          stage:
            props.stage &&
            submit &&
            nextStage && 
            editChapter
              ? FindNextStage(props.specData, props.stage, props.geometry)
              : props.stage
        }
      });
    }
  };

  const formSubmit = e => {
    e.persist();
    e.preventDefault();
    submitData(documentDate, true);
  };

  return (
    <DocumentDateContext.Provider
      value={{ documentDate, documentDateDispatch }}
    >
        <ChapterContext.Provider
          value={{
            lastChapter,
            setLastChapter,
            editChapter,
            setEditChapter
          }}
        >
          <Title title={props.document.documentTitle} />
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
              setNextStage={setNextStage}
            />
            {loadingMutation && <p>Loading...</p>}
            {errorMutation && <p>Error :( Please try again</p>}
          </Form>
          {!editChapter && !lastChapter && props.backButton ?
          <SubmitButton
            type="button"
            onClick={props.backButton}
          >
            Back
          </SubmitButton> 
          : null
        }
        </ChapterContext.Provider>
    </DocumentDateContext.Provider>
  );
};
// Form.whyDidYouRender = true;
