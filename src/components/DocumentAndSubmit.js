import React, { Fragment, useState, createContext, useEffect } from "react";
import Page from "./Page";
import query from "../request/leadEngineer/Query";
import mutations from "../request/leadEngineer/MutationToDatabase";
import objectPath from "object-path";
import SubmitButton from "./SubmitButton";
import { useMutation } from "@apollo/react-hooks";
import Title from "./Title";
import { allTrue } from "./Function";

export const ChapterContext = createContext();
export const FilesContext = createContext();
export const DocumentDateContext = createContext();
export const FieldsContext = createContext();

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
  const [editField, setEditField] = useState("");
  const [documentDate, setDocumentDate] = useState({}); // Store data for all document
  const [files, setFiles] = useState([]);
  const [isSubmited, setIsSubmited] = useState(false);
  const [validationPassed, setvalidationPassed] = useState({});
  const [addForm, setAddForm] = useState(false);

  // Set DocumentDate to empty dictionary if a new components calls DocumentAndSubmit
  useEffect(() => {
    setDocumentDate({});
  }, [props.componentsId]);

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
      update:
        !props.data ||
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
  // Save number of chaper to documentDate
  if (Object.keys(documentDate).length === 0) {
    let chapters = {};
    props.document.chapters.forEach((v, index) => {
      chapters[index + 1] = {};
    });
    return setDocumentDate({ ...chapters });
  }

  // Get data to Group or test if group have data in database
  const getData = (info, isItData = false) => {
    let data;
    if (!props.data) {
      return null;
    } else if (info.firstQueryPath) {
      data = objectPath.get(
        objectPath.get(
          props.data,
          `${info.firstQueryPath}.${props.arrayIndex}`
        ),
        info.secondQueryPath
      );
    } else if (props.data) {
      data = objectPath.get(props.data, info.queryPath);
    } else {
      console.error("ERROR, Look Up document.js message:", 1234567);
    }
    if (isItData) {
      return data[info.findByIndex ? props.arrayIndex : data.length - 1];
    } else if (info.findByIndex) {
      return data[props.arrayIndex];
    } else {
      return data;
    }
  };

  // Find or test if Group have a ForeignKey
  const testForForeignKey = info => {
    if (info.getForeignKey) {
      let foreignKey = objectPath.get(
        props.data,
        info.firstQueryPath + "." + JSON.stringify(props.arrayIndex)
      );
      if (foreignKey) {
        return foreignKey.id;
      } else {
        return 0;
      }
    } else {
      return props.foreignKey;
    }
  };

  // Adds the submit button on the right place
  const isSubmitButton = thisChapter => {
    if (editChapter) {
      if (thisChapter === editChapter) {
        return (
          <>
            <SubmitButton
              key={thisChapter}
              onClick={submitHandler.bind(this, thisChapter)}
            />
            {isSubmited && (
              <div style={{ fontSize: 12, color: "red" }}>
                See Error Message
              </div>
            )}
          </>
        );
      }
    } else if (thisChapter === lastChapter) {
      return (
        <>
          <SubmitButton
            key={thisChapter}
            onClick={submitHandler.bind(this, thisChapter)}
          />
          {isSubmited && (
            <div style={{ fontSize: 12, color: "red" }}>See Error Message</div>
          )}
        </>
      );
    }
    return null;
  };

  const prepareDataForSubmit = (variables, key, dictionary) => {
    Object.keys(dictionary).forEach(value => {
      let saveInfo = dictionary[value]["saveInfo"];
      delete dictionary[value]["saveInfo"];
      if (key === "uploadFile") {
        variables[key].push({
          ...saveInfo,
          data: JSON.stringify(dictionary[value]),
          files
        });
      } else {
        variables[key].push({
          ...saveInfo,
          data: JSON.stringify(dictionary[value])
        });
      }
    });
  };

  const submitData = data => {
    // let files;
    // if (data["files"]) {
    //   files = data["files"];
    //   delete data["files"];
    // }
    let variables = {};
    Object.keys(data).forEach(key => {
      variables[key] = [];
      prepareDataForSubmit(variables, key, data[key]);
    });
    mutation({
      variables: {
        ...variables,
        categoryId:
          Number(props.different) === 0 ? Number(props.categoryId) : undefined,
        itemId: Number(props.different) ? Number(props.itemId) : undefined,
        itemIdList: props.batchingListIds ? props.batchingListIds : undefined
      }
    });
    setFiles([]);
  };
  const submitHandler = thisChapter => {
    if (Object.values(validationPassed).every(allTrue)) {
      submitData(documentDate[thisChapter]);
      setIsSubmited(false);
      setAddForm(!addForm);
      setEditChapter(0);
      setvalidationPassed({});
    } else {
      setIsSubmited(true);
    }
  };
  console.log(documentDate);
  const view = (info, index, thisChapter, stopLoop, showEditButton) => {
    return (
      <Page
        {...info}
        {...props}
        key={`${index}-Page`}
        submitHandler={submitHandler}
        data={getData(info)}
        foreignKey={testForForeignKey(info)}
        thisChapter={thisChapter}
        stopLoop={stopLoop}
        showEditButton={showEditButton}
        indexId={`${thisChapter}-${index}`}
        index={index}
        addForm={addForm}
        submitData={submitData}
        categoryId={
          Number(props.different) === 0 ? Number(props.categoryId) : 0
        }
        itemId={Number(props.different) ? Number(props.itemId) : 0}
        mutation={mutation}
      />
    );
  };

  let stopLoop = false; // True when we are at the first chaper now one have wirte on
  let lastChapter = 0; // Default chapter in wirte
  // Map through chaper in document
  const document = props.document.chapters.map((pageInfo, firstIndex) => {
    let chapter; // new chapter to add to document
    if (pageInfo.chapterAlwaysInWrite && !lastChapter) {
      lastChapter = firstIndex + 1;
    }
    if (stopLoop) {
      chapter = null;
    } else {
      let getDataFromGroupWithLookUpBy = getData(pageInfo, true);
      // if now data in lookUpBy this is last chapter
      if (
        !getDataFromGroupWithLookUpBy ||
        getDataFromGroupWithLookUpBy.data.trim() === "" ||
        !JSON.parse(getDataFromGroupWithLookUpBy.data.replace(/'/g, '"'))[
          pageInfo.lookUpBy
        ]
      ) {
        lastChapter = firstIndex + 1;
      }
      // Map through pages in this chaper
      chapter = pageInfo.pages.map((info, index) => {
        let showEditButton = !props.notEditButton && !index ? true : false;
        let page = view(info, index, firstIndex + 1, stopLoop, showEditButton);
        return (
          <Fragment key={`${index}-${firstIndex}-cancas`}>
            {page}
            {index === pageInfo.pages.length - 1 &&
              !editField &&
              isSubmitButton(firstIndex + 1)}
          </Fragment>
        );
      });
      // if now data in lookUpBy stop loop
      if (
        !getDataFromGroupWithLookUpBy ||
        getDataFromGroupWithLookUpBy.data.trim() === "" ||
        !JSON.parse(getDataFromGroupWithLookUpBy.data.replace(/'/g, '"'))[
          pageInfo.lookUpBy
        ]
      ) {
        stopLoop = true;
      }
    }
    // return chapter
    return (
      <>
        {chapter ? (
          <Title key={firstIndex} title={pageInfo.pages.chapterTitle} />
        ) : null}
        <Fragment key={`${firstIndex}-cancas`}>{chapter}</Fragment>
      </>
    );
  });
  return (
    <DocumentDateContext.Provider value={{ documentDate, setDocumentDate }}>
      <FieldsContext.Provider
        value={{
          validationPassed,
          setvalidationPassed,
          editField,
          setEditField,
          isSubmited,
          setIsSubmited
        }}
      >
        <ChapterContext.Provider
          value={{ lastChapter, editChapter, setEditChapter }}
        >
          <FilesContext.Provider value={{ files, setFiles }}>
            <Title title={props.document.documentTitle} />
            {document}
            {loadingMutation && <p>Loading...</p>}
            {errorMutation && <p>Error :( Please try again</p>}
          </FilesContext.Provider>
        </ChapterContext.Provider>
      </FieldsContext.Provider>
    </DocumentDateContext.Provider>
  );
};
