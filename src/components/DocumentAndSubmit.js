import React, {
  Fragment,
  useState,
  createContext,
  useEffect,
  useCallback
} from "react";
import Page from "./Page";
import query from "../request/leadEngineer/Query";
import mutations from "../request/leadEngineer/MutationToDatabase";
import objectPath from "object-path";
import { Card, Container } from "react-bootstrap";
import SubmitButton from "./SubmitButton";
import { useMutation } from "@apollo/react-hooks";
import Title from "./Title";

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
  const [editField, setEditField] = useState(0);
  const [documentDate, setDocumentDate] = useState({});
  const [files, setFiles] = useState([]);
  const [isSubmited, setIsSubmited] = useState(false);
  const [validationPassed, setvalidationPassed] = useState({});
  const [addForm, setAddForm] = useState(false);

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

  if (Object.keys(documentDate).length === 0) {
    let chapters = {};
    props.document.chapters.forEach((v, index) => {
      chapters[index + 1] = {};
    });
    return setDocumentDate({ ...chapters });
  }

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
          Number(props.different) === 0 ? Number(props.categoryId) : 0,
        itemId: Number(props.different) ? Number(props.itemId) : 0
      }
    });
    setFiles([]);
  };

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
  const submitHandler = thisChapter => {
    console.log("submitData");
    let submit = true;
    Object.keys(validationPassed).forEach(key => {
      if (!validationPassed[key]) {
        submit = false;
      }
    });
    if (submit) {
      submitData(documentDate[thisChapter]);
      setEditField(null);
      setIsSubmited(false);
      setAddForm(!addForm);
      setEditChapter(0);
      setvalidationPassed({});
    } else {
      setIsSubmited(true);
    }
  };
  const view = (info, index, thisChapter, stopLoop, showEidtButton) => {
    return (
      <Page
        {...info}
        {...props}
        key={`${index}-Page`}
        submitHandler={submitHandler}
        data={getData(info)}
        mutation={mutations[info.mutation]}
        queryPath={info.queryPath}
        query={query[info.query]}
        foreignKey={testForForeignKey(info)}
        thisChapter={thisChapter}
        stopLoop={stopLoop}
        showEidtButton={showEidtButton}
        indexId={`${thisChapter}-${index}`}
        index={index}
        isSubmited={isSubmited}
        addForm={addForm}
      />
    );
  };
  let stopLoop = false;
  let lastChapter = 0;
  const document = props.document.chapters.map((pageInfo, firstIndex) => {
    let chapter;
    if (pageInfo.showForm && !lastChapter) {
      lastChapter = firstIndex + 1;
    }
    if (stopLoop) {
      chapter = null;
    } else {
      if (
        !getData(pageInfo, true) ||
        getData(pageInfo, true).data.trim() === "" ||
        !JSON.parse(getData(pageInfo, true).data.replace(/'/g, '"'))[
          pageInfo.lookUpBy
        ]
      ) {
        lastChapter = firstIndex + 1;
      }
      chapter = pageInfo.pages.map((info, index) => {
        let showEidtButton = !props.notEidtButton && !index ? true : false;
        let page = view(info, index, firstIndex + 1, stopLoop, showEidtButton);
        return (
          <Fragment key={`${index}-${firstIndex}-cancas`}>
            {page}
            {index === pageInfo.pages.length - 1 &&
              isSubmitButton(firstIndex + 1)}
          </Fragment>
        );
      });
      if (
        !getData(pageInfo, true) ||
        getData(pageInfo, true).data.trim() === "" ||
        !JSON.parse(getData(pageInfo, true).data.replace(/'/g, '"'))[
          pageInfo.lookUpBy
        ]
      ) {
        stopLoop = true;
      }
    }
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
          setvalidationPassed,
          editField,
          setEditField,
          isSubmited
        }}
      >
        <ChapterContext.Provider
          value={{ lastChapter, editChapter, setEditChapter }}
        >
          <FilesContext.Provider value={{ files, setFiles }}>
            <Container className="mt-0 mt-sm-3 p-0">
              <Card
                className="shadow-sm"
                style={{ minHeight: "80vh", height: "100%" }}
              >
                <Card.Body key={2}>
                  <Title title={props.document.documentTitle} />
                  {document}
                  {loadingMutation && <p>Loading...</p>}
                  {errorMutation && <p>Error :( Please try again</p>}
                </Card.Body>
              </Card>
            </Container>
          </FilesContext.Provider>
        </ChapterContext.Provider>
      </FieldsContext.Provider>
    </DocumentDateContext.Provider>
  );
};
