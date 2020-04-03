import React, {
  useState,
  createContext,
  useEffect,
  useLayoutEffect
} from "react";
import Chapters from "./Chapters";
import query from "../request/leadEngineer/Query";
import mutations from "../request/leadEngineer/MutationToDatabase";
import objectPath from "object-path";
import { Form } from "react-bootstrap";
import { useMutation } from "@apollo/react-hooks";
import Title from "components/text/Title";
import { allTrue, validaFieldWithValue, stringifyQuery } from "./Functions";

import FindNextStage from "components/stages/FindNextStage";

export const ChapterContext = createContext();
export const FilesContext = createContext();
export const DocumentDateContext = createContext();
export const FieldsContext = createContext();

// let document;
const cloneDeep = require("clone-deep");

export default props => {
  useEffect(() => {
    if (!props.componentsId) {
      console.error(
        "Du har ikke gitt komponent Canvas en 'componentsId'. Tips: Sett componentsId lik navnet på komponenten som kjører Canvas komponeten."
      );
    }
    if (props.document === undefined && props.document === null) {
      console.error("Du må gi en 'document' til komponent Canvas");
    }
    if (props.data === undefined && props.data === null) {
      console.error("Du må gi en 'data' til komponent Canvas");
    }
  }, [props.componentsId, props.document, props.data]);
  const [editChapter, setEditChapter] = useState(0);
  const [documentDate, setDocumentDate] = useState(); // Store data for all document
  const [nextStage, setNextStage] = useState(true);
  const [lastSubmitButton, setLastSubmitButton] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  const [validationPassed, setvalidationPassed] = useState({});
  const [lastChapter, setLastChapter] = useState(0);
  // Set DocumentDate to empty dictionary if a new components calls DocumentAndSubmit
  useLayoutEffect(() => {
    if (props.data) {
      setDocumentDate(cloneDeep(props.data));
    }
  }, [props.componentsId, props.data]);
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
      secondQueryPath = `.${props.arrayIndex}.${props.secondQueryPath}`;
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
      `${props.firstQueryPath}.${props.arrayIndex}.${props.secondQueryPath}`,
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

  const submitData = data => {
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
            props.saveButton &&
            nextStage &&
            Object.values(validationPassed).every(allTrue) &&
            FindNextStage(props.speckData, props.stage, props.geometry)
        }
      });
    }
  };

  const submitHandler = data => {
    if (
      (props.saveButton && validaFieldWithValue(validationPassed)) ||
      Object.values(validationPassed).every(allTrue)
    ) {
      submitData(data);
      setIsSubmited(false);
      setvalidationPassed({});
      setNextStage(true);
      if (lastSubmitButton && props.lastbutton) {
        props.lastbutton();
      }
      setEditChapter(0);
    } else {
      setIsSubmited(true);
    }
  };

  if (documentDate) {
    return (
      <DocumentDateContext.Provider value={{ documentDate, setDocumentDate }}>
        <FieldsContext.Provider
          value={{
            validationPassed,
            setvalidationPassed,
            isSubmited,
            setIsSubmited
          }}
        >
          <ChapterContext.Provider
            value={{ lastChapter, setLastChapter, editChapter, setEditChapter }}
          >
            <Title title={props.document.documentTitle} />
            <Form
              onSubmit={e => {
                e.persist();
                e.preventDefault();
                submitHandler(documentDate);
              }}
            >
              <Chapters
                {...props}
                submitHandler={submitHandler}
                submitData={submitData}
                mutation={mutation}
                setNextStage={setNextStage}
                setLastSubmitButton={setLastSubmitButton}
              />
              {loadingMutation && <p>Loading...</p>}
              {errorMutation && <p>Error :( Please try again</p>}
            </Form>
          </ChapterContext.Provider>
        </FieldsContext.Provider>
      </DocumentDateContext.Provider>
    );
  } else {
    return null;
  }
};
