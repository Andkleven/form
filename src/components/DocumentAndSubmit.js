import React, {
  useState,
  createContext,
  useEffect,
  Fragment,
  useMemo,
  useLayoutEffect
} from "react";
import Page from "./Page";
import query from "../request/leadEngineer/Query";
import mutations from "../request/leadEngineer/MutationToDatabase";
import objectPath from "object-path";
import { Form } from "react-bootstrap";
import { useMutation } from "@apollo/react-hooks";
import Title from "./Title";
import {
  chapterPages,
  emptyField,
  notDataInField,
  allTrue,
  validaFieldWithValue,
  getDataFromQuery,
  getData,
  mergePath,
  stringifyQuery
} from "./Functions";
import FindNextStage from "components/stages/FindNextStage";

export const ChapterContext = createContext();
export const FilesContext = createContext();
export const DocumentDateContext = createContext();
export const FieldsContext = createContext();

let document;

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
  const [files, setFiles] = useState([]);
  const [isSubmited, setIsSubmited] = useState(false);
  const [validationPassed, setvalidationPassed] = useState({});
  const [repeatGroup, setRepeatGroup] = useState(false);
  const [lastChapter, setLastChapter] = useState(0);

  // Set DocumentDate to empty dictionary if a new components calls DocumentAndSubmit
  useLayoutEffect(() => {
    if (props.data) {
      setDocumentDate(JSON.parse(JSON.stringify(props.data)));
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

  const createDocumentFromForm = (props, view) => {
    let stopLoop = false; // True when we are at the first chaper now one have wirte on

    let temporaryLastChapter = 0;
    const document = props.document.chapters.map((pageInfo, firstIndex) => {
      let chapter; // new chapter to add to document
      if (pageInfo.chapterAlwaysInWrite && !lastChapter) {
        temporaryLastChapter = firstIndex + 1;
      }
      if (stopLoop) {
        chapter = null;
      } else {
        let getDataFromGroupWithLookUpBy = getData(
          pageInfo,
          props.arrayIndex,
          props.data,
          true
        );

        // if now data in lookUpBy this is last chapter
        if (notDataInField(getDataFromGroupWithLookUpBy, pageInfo.lookUpBy)) {
          temporaryLastChapter = firstIndex + 1;
        }
        // Map through pages in this pages
        chapter = pageInfo.pages.map((info, index) => {
          let showEditButton = !props.notEditButton && !index ? true : false;
          let showSaveButton =
            index === pageInfo.pages.length - 1 && !props.notSubmitButton
              ? true
              : false;
          let page = view(
            info,
            index,
            firstIndex + 1,
            stopLoop,
            showEditButton,
            showSaveButton
          );
          return (
            <Fragment key={`${index}-${firstIndex}-cancas`}>{page}</Fragment>
          );
        });
        // if now data in lookUpBy stop loop
        if (notDataInField(getDataFromGroupWithLookUpBy, pageInfo.lookUpBy)) {
          stopLoop = true;
        }
      }
      return (
        <Fragment key={`${firstIndex}-cancas`}>
          {chapter ? (
            <Title key={firstIndex} title={pageInfo.pages.chapterTitle} />
          ) : null}
          {chapter}
        </Fragment>
      );
    });
    setLastChapter(temporaryLastChapter);
    return document;
  };

  const createDocumentFromSpeck = (props, view) => {
    let stopLoop = false; // True when we are at the first chaper now one have wirte on
    const subchapter = (
      getDataFromGroupWithLookUpBy,
      i,
      chaptersInfo,
      chapter
    ) => {
      let thisChapter;
      chapterCount += 1;
      if (
        notDataInField(getDataFromGroupWithLookUpBy[i], chaptersInfo.lookUpBy)
      ) {
        setLastChapter(chapterCount);
      }
      if (stopLoop && chapter.length === 0) {
        chapter = null;
      } else if (!stopLoop) {
        thisChapter = chapterPages(
          props,
          view,
          chapterCount,
          stopLoop,
          chaptersInfo
        );
      }
      if (
        notDataInField(getDataFromGroupWithLookUpBy[i], chaptersInfo.lookUpBy)
      ) {
        stopLoop = true;
      }
      chapter.push(
        <Fragment key={`${chapterCount}-cancas`}>
          {thisChapter ? (
            <Title key={chapterCount} title={chaptersInfo.chapterTitle} />
          ) : null}
          {thisChapter}
        </Fragment>
      );
    };

    let chapterCount = 0;
    const document = Object.values(
      props.chaptersJson[
        props.specificStage ? ["chapters"][props.specificStage] : "chapters"
      ]
    ).map(chaptersInfo => {
      let chapter;
      if (stopLoop) {
        chapter = null;
      } else {
        let getDataFromGroupWithLookUpBy = getData(
          chaptersInfo,
          props.arrayIndex,
          props.data
        );
        chapter = [];
        if (chaptersInfo.numberFromSpackField) {
          let speckChapterData = getDataFromQuery(
            props.speckData,
            chaptersInfo.spackQueryPath,
            chaptersInfo.spackFieldPath
          );
          if (emptyField(speckChapterData)) {
            return null;
          }
          for (let i = 0; i < Number(speckChapterData); i++) {
            subchapter(getDataFromGroupWithLookUpBy, i, chaptersInfo, chapter);
          }
        } else if (emptyField(chaptersInfo.spackQueryPath)) {
          subchapter(getDataFromGroupWithLookUpBy, 0, chaptersInfo, chapter);
        } else if (emptyField(chaptersInfo.spackFieldPath)) {
          if (
            !emptyField(
              objectPath.get(props.speckData, chaptersInfo.spackQueryPath, null)
            )
          ) {
            subchapter(getDataFromGroupWithLookUpBy, 0, chaptersInfo, chapter);
          } else {
            return null;
          }
        } else if (
          !emptyField(
            getDataFromQuery(
              props.speckData,
              chaptersInfo.spackQueryPath,
              chaptersInfo.spackFieldPath
            )
          )
        ) {
          subchapter(getDataFromGroupWithLookUpBy, 0, chaptersInfo, chapter);
        } else {
          return null;
        }
      }
      return chapter;
    });
    return document;
  };

  // Find or test if Group have a ForeignKey
  const testForForeignKey = info => {
    if (info.getForeignKey) {
      let foreignKey = objectPath.get(
        documentDate,
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
  // useEffect(() => {
  //   if (errorMutation) {
  //     objectifyQuery(documentDate);
  //   }
  // }, [errorMutation]);
  // Adds the submit button on the right place
  // const isSubmitButton = useCallback(
  //   thisChapter => {
  //     if (editChapter) {
  //       if (thisChapter === editChapter) {
  //         return (
  //           <>
  //             <SubmitButton key={thisChapter} onClick={() => submitHandler()} />
  //             {isSubmited && (
  //               <div style={{ fontSize: 12, color: "red" }}>
  //                 See Error Message
  //               </div>
  //             )}
  //           </>
  //         );
  //       }
  //     } else if (thisChapter === lastChapter) {
  //       return (
  //         <>
  //           <SubmitButton
  //             key={thisChapter}
  //             onClick={() => submitHandler()}
  //             name={
  //               props.saveButton &&
  //               !Object.values(validationPassed).every(allTrue)
  //                 ? "Save"
  //                 : null
  //             }
  //           />
  //           {isSubmited && (
  //             <div style={{ fontSize: 12, color: "red" }}>
  //               See Error Message
  //             </div>
  //           )}
  //         </>
  //       );
  //     }
  //     return null;
  //   },
  //   [lastChapter]
  // );

  const submitData = documentDateNow => {
    if (documentDateNow) {
      let variables = stringifyQuery(
        JSON.parse(JSON.stringify(documentDateNow))
      );
      mutation({
        variables: {
          ...variables,
          descriptionId:
            Number(props.different) === 0
              ? Number(props.descriptionId)
              : undefined,
          itemId: Number(props.different) ? Number(props.itemId) : undefined,
          itemIdList: props.batchingListIds ? props.batchingListIds : undefined,
          stage:
            props.saveButton && Object.values(validationPassed).every(allTrue)
              ? FindNextStage(documentDate, props.stage, props.geometry)
              : undefined
        }
      });
      setFiles([]);
    }
  };
  const submitHandler = documentDateNow => {
    if (
      (props.saveButton && validaFieldWithValue(validationPassed)) ||
      Object.values(validationPassed).every(allTrue)
    ) {
      submitData(documentDateNow);
      setIsSubmited(false);
      setRepeatGroup(!repeatGroup);
      setEditChapter(0);
      setvalidationPassed({});
    } else {
      setIsSubmited(true);
    }
  };
  const view = (
    info,
    index,
    thisChapter,
    stopLoop,
    showEditButton,
    showSaveButton
  ) => {
    return (
      <Page
        {...info}
        {...props}
        key={`${index}-Page`}
        submitHandler={submitHandler}
        data={getData(info, props.arrayIndex, props.data)}
        path={mergePath(info, props.arrayIndex)}
        foreignKey={testForForeignKey(info)}
        thisChapter={thisChapter}
        stopLoop={stopLoop}
        showEditButton={showEditButton}
        indexId={`${thisChapter}-${index}`}
        index={index}
        repeatGroup={repeatGroup}
        submitData={submitData}
        mutation={mutation}
        showSaveButton={showSaveButton}
      />
    );
  };
  useMemo(() => {
    if (props.stageForm) {
      document = createDocumentFromSpeck(props, view);
    } else {
      document = createDocumentFromForm(props, view);
    }
  }, [props.data]);
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
            value={{ lastChapter, editChapter, setEditChapter }}
          >
            <FilesContext.Provider value={{ files, setFiles }}>
              <Title title={props.document.documentTitle} />
              <Form
                onSubmit={e => {
                  e.persist();
                  e.preventDefault();
                  submitHandler();
                }}
              >
                {document}
                {loadingMutation && <p>Loading...</p>}
                {errorMutation && <p>Error :( Please try again</p>}
              </Form>
            </FilesContext.Provider>
          </ChapterContext.Provider>
        </FieldsContext.Provider>
      </DocumentDateContext.Provider>
    );
  } else {
    return null;
  }
};
