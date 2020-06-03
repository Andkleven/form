import React, {
  useEffect,
  useContext,
  useLayoutEffect,
  useMemo,
  useCallback,
  useRef
} from "react";
import SelectSetFieldGroupData from "components/form/components/fields/SelectSetFieldGroupData";
import { ChapterContext, DocumentDateContext } from "components/form/Form";
import Title from "components/design/fonts/Title";
import { getRepeatNumber } from "functions/general";
import Input from "components/input/Input";
import objectPath from "object-path";
import Subtitle from "components/design/fonts/Subtitle";
import CustomComponents from "components/form/components/CustomElement";
import Line from "components/design/Line";
import SubmitButton from "components/button/SubmitButton";
import CancelButton from "components/button/CancelButton";
import TabButton from "components/button/TabButton";

export default props => {
  const {
    setLastChapter,
    lastChapter,
    editChapter,
    setEditChapter
  } = useContext(ChapterContext);
  const { documentDateDispatch, documentDate } = useContext(
    DocumentDateContext
  );

  const writeChapter = useRef(false);
  useLayoutEffect(() => {
    if (
      props.temporaryLastChapter &&
      props.temporaryLastChapter !== lastChapter
    ) {
      setLastChapter(props.temporaryLastChapter);
    }
  }, [props.temporaryLastChapter, setLastChapter, lastChapter]);

  const addData = useCallback(
    pushOnIndex => {
      documentDateDispatch({
        type: "add",
        newState: {},
        fieldName: "data",
        path: `${props.path}.${pushOnIndex}`
      });
    },
    [props.path, documentDateDispatch]
  );

  const addHandler = () => {
    documentDateDispatch({
      type: "add",
      newState: {},
      fieldName: "data",
      path: `${props.path}.${objectPath.get(documentDate, props.path).length}`
    });
  };
  const deleteHandler = useCallback(
    index => {
      documentDateDispatch({ type: "delete", path: `${props.path}.${index}` });
    },
    [props.path, documentDateDispatch]
  );

  // set repeatGroup
  // useEffect(() => {
  if (props.allWaysShow) {
    writeChapter.current = true;
  } else if (editChapter) {
    if (props.thisChapter === editChapter) {
      writeChapter.current = true;
    } else {
      writeChapter.current = false;
    }
  } else if (props.thisChapter === props.temporaryLastChapter) {
    writeChapter.current = true;
  } else {
    writeChapter.current = false;
  }
  // }, [props.allWaysShow, editChapter, props.thisChapter, props.temporaryLastChapter, props.componentsId]);

  // If repeat group start with one group set repeatGroup to 1
  if (
    props.repeatStartWithOneGroup &&
    writeChapter.current &&
    (!objectPath.get(props.data, props.path) ||
      objectPath.get(props.data, props.path).length === 0) &&
    Array.isArray(objectPath.get(documentDate, props.path)) &&
    objectPath.get(documentDate, props.path).length === 0
  ) {
    addData(0);
  }


  // If number of repeat group decides by a another field, it's sets repeatGroup
  useEffect(() => {
    if (
      props.repeatGroupWithQuery &&
      !props.repeatGroupWithQuerySpecData
      // &&
      // objectPath.get(documentDateContext.documentDate, props.path)
    ) {
      let newValue = getRepeatNumber(
        documentDate,
        props.repeatGroupWithQuery,
        props.repeatStepList,
        props.editRepeatStepListRepeat
      );
      let oldValue = objectPath.get(documentDate, props.path, false);
      let oldValueLength = oldValue ? oldValue.length : 0;
      if (oldValueLength < newValue) {
        for (let i = oldValueLength; i < newValue; i++) {
          addData(i);
        }
      } else if (newValue < oldValueLength) {
        for (let i = oldValueLength - 1; i > newValue - 1; i--) {
          deleteHandler(i);
        }
      }
    }
  }, [
    documentDate,
    addData,
    props.repeatGroupWithQuery,
    props.repeatStepList,
    props.editRepeatStepListRepeat,
    deleteHandler,
    props.path,
    props.repeatGroupWithQuerySpecData
  ]);

  if (
    props.repeatGroupWithQuery &&
    props.repeatGroupWithQuerySpecData &&
    props.queryPath
  ) {
    let newValue = getRepeatNumber(
      props.specData,
      props.repeatGroupWithQuery,
      props.repeatStepList,
      props.editRepeatStepListRepeat
    );
    if (objectPath.get(documentDate, `${props.path}.${0}`, null) === null) {
      for (let i = 0; i < newValue; i++) {
        addData(i);
      }
    }
  }

  const Components = useMemo(() => CustomComponents[props.customComponent], [
    props.customComponent
  ]);

  // Checks for conditional rendering
  const showEditAll =
    props.showEditButton &&
    !props.stopLoop &&
    !writeChapter.current &&
    props.thisChapter !== lastChapter;
  const showCancel =
    !!editChapter && props.thisChapter !== lastChapter && props.pageTitle;
  const showLine = props.pageTitle && true;

  const SubmitButtonFunctional = () => {
    return (
      <SubmitButton
        type="submit"
        // onClick={() => props.submitHandler(documentDate)}
      />
    );
  };

  const cancel = e => {
    documentDateDispatch({ type: "setState", newState: props.backendData });
    setEditChapter(0);
  };

  const CancelButtonFunctional = () => {
    return (
      <CancelButton
        onClick={e => cancel()}
      />
    );
  };

  const SubmitAndCancel = () => {
    return (
      <div className="w-100 d-flex">
        <SubmitButtonFunctional />
        <div className="px-1" />
        <CancelButtonFunctional />
      </div>
    );
  };

  const SaveButton = () => (
    <SubmitButton
      type="button"
      onClick={(event) => {
        event.persist();
        event.preventDefault();
        props.submitData(documentDate, false)
      }}
    >
    save
    </SubmitButton>
    );

  return (
    <div className={`${!props.temporaryLastChapter && "mb-4"}`}>
      <div className="d-flex justify-content-between align-items-end">
        {!props.stopLoop &&
        props.pageTitle &&
        props.indexVariablePageTitle === undefined ? (
          <Title>{props.pageTitle}</Title>
        ) : null}

        {showEditAll ? (
            <TabButton
              // size="sm"
              onClick={() => {
                // if (window.confirm("Are you sure you wish to edit?")) {
                setEditChapter(props.thisChapter);
                documentDateDispatch({
                  type: "setState",
                  newState: props.backendData
                });
                // }
              }}
            >
              Edit all
            </TabButton>
        ) : (
          showCancel && (
            <>
              <TabButton
                // size="sm"
                onClick={() => {
                  // if (window.confirm("Are you sure you wish to edit?")) {
                  cancel();
                  // }
                }}
              >
                Cancel
              </TabButton>
          )
        )}
      </div>
      {showLine && <Line />}
      {Components ? <Components {...props} /> : null}
      {props.fields ? (
        <>
          <SelectSetFieldGroupData
            {...props}
            writeChapter={writeChapter.current}
            deleteHandler={deleteHandler}
          />
          {!props.notAddButton && props.repeat && writeChapter.current ? (
            <button
              type="button"
              onClick={() => {
                addHandler();
              }}
            >
              {props.addButton ? props.addButton : "Add"}
            </button>
          ) : null}
        </>
      ) : props.type === "file" ? (
        <Input {...props} writeChapter={writeChapter.current} />
      ) : null}
      {props.showSaveButton ? (
        editChapter ? (
          props.thisChapter === editChapter && (
            <>
          <SubmitAndCancel /> 
          {props.saveButton && <SaveButton />}
          </>
          )
        ) : props.thisChapter === props.temporaryLastChapter ? (
          <>
        <SubmitAndCancel /> 
        {props.saveButton && <SaveButton />}
        </>
        ) : null
      ) : null}
    </div>
  );
};
