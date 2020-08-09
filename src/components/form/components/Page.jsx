import React, {
  useEffect,
  useContext,
  useLayoutEffect,
  useCallback,
  useRef,
  useState
} from "react";
import SelectSetFieldGroupData from "components/form/components/fields/SelectSetFieldGroupData";
import { ChapterContext, documentDataContext } from "components/form/Form";
import Title from "components/design/fonts/Title";
import { getRepeatNumber, isNumberAndNotNaN } from "functions/general";
import objectPath from "object-path";
import CustomComponents from "components/form/components/CustomElement";
import Line from "components/design/Line";
import TabButton from "components/button/TabButton";
import DepthButton from "components/button/DepthButton";
import DepthButtonGroup from "components/button/DepthButtonGroup";
import Input from "components/input/Input";
import { dialog } from "components/Dialog";

export default React.memo(props => {
  const {
    setFinalChapter,
    finalChapter,
    editChapter,
    setEditChapter
  } = useContext(ChapterContext);
  const { documentDataDispatch, documentData, renderFunction, resetState } = useContext(
    documentDataContext
  );
  const [addOrRemove, setAddOrRemove] = useState(0);
  const writeChapter = useRef(false);
  useEffect(() => {
    if (props.repeat) {
      setAddOrRemove(prevState => prevState + 1);
    }
  }, [props.backendData, props.path, props.repeat]);

  useLayoutEffect(() => {
    if (props.finalChapter && props.finalChapter !== finalChapter) {
      setFinalChapter(props.finalChapter);
    }
  }, [props.finalChapter, setFinalChapter, finalChapter]);

  const addData = useCallback(
    pushOnIndex => {
      documentDataDispatch({
        type: "add",
        newState: {},
        fieldName: "data",
        path: `${props.path}.${pushOnIndex}`
      });
      setAddOrRemove(prevState => prevState + 1);
    },
    [props.path, documentDataDispatch, setAddOrRemove]
  );
  const addHandler = useCallback(() => {
    if (objectPath.get(documentData.current, props.path) === undefined) {
      documentDataDispatch({
        type: "add",
        newState: {},
        fieldName: "data",
        path: `${props.path}.0`
      });
    } else {
      documentDataDispatch({
        type: "add",
        newState: {},
        fieldName: "data",
        path: `${props.path}.${
          objectPath.get(documentData.current, props.path).length
          }`
      });
    }
    setAddOrRemove(prevState => prevState + 1);
  }, [documentDataDispatch, props.path, documentData, setAddOrRemove]);

  const deleteHandler = useCallback(
    index => {
      documentDataDispatch({
        type: "delete",
        path: `${props.path}.${index}`
      });
      setAddOrRemove(prevState => prevState + 1);
      Object.values(resetState.current)
        .forEach(func => {
          func();
        });
    },
    [props.path, documentDataDispatch, setAddOrRemove, resetState]
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
  } else if (props.thisChapter === props.finalChapter) {
    writeChapter.current = true;
  } else {
    writeChapter.current = false;
  }
  // }, [props.allWaysShow, editChapter, props.thisChapter, props.finalChapter, props.componentsId]);

  // If number of repeat group decided by a another field, it sets repeatGroup
  const autoRepeat = useCallback(
    (data = documentData.current) => {
      let newValue = getRepeatNumber(
        data,
        props.repeatGroupWithQuery,
        props.repeatStepList,
        props.editRepeatStepListRepeat
      );
      let oldValue = objectPath.get(documentData.current, props.path, false);
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
    },
    [
      documentData,
      props.repeatGroupWithQuery,
      props.repeatStepList,
      props.editRepeatStepListRepeat,
      props.path,
      addData,
      deleteHandler
    ]
  );
  useEffect(() => {
    let effectsRenderFunction = renderFunction.current;
    if (
      props.repeatGroupWithQuery &&
      !props.repeatGroupWithQuerySpecData &&
      writeChapter.current
    ) {
      effectsRenderFunction[`${props.repeatStepList}-Page`] = autoRepeat;
    }
    return () => {
      if (
        props.repeatGroupWithQuery &&
        !props.repeatGroupWithQuerySpecData &&
        writeChapter.current
      ) {
        delete effectsRenderFunction[`${props.repeatStepList}-Page`];
      }
    };
  }, [
    props.repeatGroupWithQuery,
    props.repeatStepList,
    props.editRepeatStepListRepeat,
    props.repeatGroupWithQuerySpecData,
    autoRepeat,
    renderFunction
  ]);

  useEffect(() => {
    if (props.repeatGroupWithQuery && writeChapter.current) {
      if (!props.repeatGroupWithQuerySpecData) {
        autoRepeat(Object.keys(documentData.current).length === 0
          ? props.backendData
          : documentData.current);
      } else if (props.repeatGroupWithQuerySpecData) {
        autoRepeat(props.specData);
      }
    }
  }, [
    props.backendData,
    autoRepeat,
    props.specData,
    props.repeatGroupWithQuery,
    props.repeatGroupWithQuerySpecData,
    documentData
  ]);

  if (
    objectPath.get(documentData.current, props.path, null) === null &&
    objectPath.get(props.backendData, props.path, null) === null &&
    !isNumberAndNotNaN(
      Number(props.path.split(".")[props.path.split(".").length - 1])
    )
  ) {
    documentDataDispatch({
      type: "add",
      notReRender: true,
      newState: [],
      path: props.path
    });
  }

  if (
    props.repeatStartWithOneGroup &&
    writeChapter.current &&
    (!objectPath.get(props.backendData, props.path) ||
      objectPath.get(props.backendData, props.path).length === 0) &&
    Array.isArray(objectPath.get(documentData.current, props.path)) &&
    objectPath.get(documentData.current, props.path).length === 0
  ) {
    addData(0);
  }

  const Components = CustomComponents[props.customComponent];

  const SubmitButton = () => {
    return (
      <DepthButton
        iconProps={{ icon: ["fas", "check"], className: "text-success" }}
        short
        type="submit"
      >
        Submit
      </DepthButton>
    );
  };

  const save = e => {
    e.persist();
    e.preventDefault();
    props.submitData(documentData.current, false);
  };

  const SaveButton = () => (
    <DepthButton
      iconProps={{ icon: ["fas", "save"], className: "text-info" }}
      short
      align="center"
      onClick={e => {
        save(e);
      }}
    >
      Save
    </DepthButton>
  );

  const cancel = () => {
    console.log(3)
    documentDataDispatch({ type: "setState", newState: props.backendData });
    setEditChapter(0);
  };

  const CancelButton = () => {
    return (
      <DepthButton
        iconProps={{ icon: ["fas", "times"], className: "text-secondary" }}
        short
        onClick={() => cancel()}
      >
        Cancel
      </DepthButton>
    );
  };
  const SubmitAndCancel = () => {
    return (
      <DepthButtonGroup className="w-100 d-flex">
        {!props.notSubmitButton && <SubmitButton />}
        {finalChapterActive && !props.noSaveButton && <SaveButton />}
        {showCancel && <CancelButton />}
      </DepthButtonGroup>
    );
  };

  // Checks for conditional rendering
  const showEditAll =
    props.showEditButton &&
    !props.stopLoop &&
    !writeChapter.current &&
    props.edit;
  // && props.thisChapter !== finalChapter;
  const showTitle =
    !props.stopLoop &&
    props.pageTitle &&
    props.indexVariablePageTitle === undefined;
  const showLine =
    (showTitle || showEditAll) &&
    !props.noLine &&
    !!props.pageTitle &&
    !["", " "].includes(props.pageTitle);
  const showCancel = !!editChapter;
  const showCancelTab =
    showLine &&
    !!editChapter &&
    props.thisChapter !== finalChapter &&
    props.pageTitle;
  const editAllActive =
    props.showSubmitButton && editChapter && props.thisChapter === editChapter;
  const finalChapterActive =
    props.showSubmitButton &&
    !editChapter &&
    props.thisChapter === props.finalChapter;
  const finalPage = props.showSubmitButton;

  // MultipleFiles logic
  // TODO: Make functions for these variables
  // const readMf = true;
  // const onEditMf = () => {};
  // const onSubmitMf = () => {};
  // const onCancelMf = () => {};

  return (
    <div
      className={`${finalPage && "mb-5"} ${props.className}`}
    // className={`${!props.finalChapter && ""} ${props.className}`}
    >
      <div className="d-flex justify-content-between align-items-end">
        {showTitle ? (
          <Title>{props.pageTitle}</Title>
        ) : showEditAll ? (
          <div></div>
        ) : null}
        {showEditAll ? (
          <TabButton
            onClick={() => {
              if (
                JSON.stringify(documentData.current) ===
                JSON.stringify(props.backendData)
              ) {
                console.log(2)
                documentDataDispatch({
                  type: "setState",
                  newState: props.backendData
                });
                setEditChapter(props.thisChapter);
              } else {
                dialog({
                  message: "Do you want to save your changes?",
                  buttons: [
                    {
                      label: "Save and continue",
                      variant: "success",
                      type: "submit",
                      onClick: () => {
                        props.submitData(documentData.current, false);
                        console.log(4)

                        documentDataDispatch({
                          type: "setState",
                          newState: props.backendData
                        });
                        setEditChapter(props.thisChapter);
                      }
                    },
                    {
                      label: "Discard and continue",
                      variant: "danger",

                      onClick: () => {
                        console.log(5)
                        documentDataDispatch({
                          type: "setState",
                          newState: props.backendData
                        });
                        setEditChapter(props.thisChapter);
                      }
                    }
                  ]
                });
              }
            }}
          >
            Edit all
          </TabButton>
        ) : (
            showCancelTab && (
              <TabButton
                onClick={() => {
                  if (
                    JSON.stringify(documentData.current) ===
                    JSON.stringify(props.backendData)
                  ) {
                    cancel();
                  } else {
                    dialog({
                      message: "Do you want to save your changes?",
                      buttons: [
                        {
                          label: "Save and continue",
                          variant: "success",
                          type: "submit",
                          onClick: () => {
                            props.submitData(documentData.current, false);
                            setEditChapter(0);
                          }
                        },
                        {
                          label: "Discard and continue",
                          variant: "danger",
                          onClick: () => {
                            cancel();
                          }
                        }
                      ]
                    });
                  }
                }}
              >
                Cancel
              </TabButton>
            )
          )}
      </div>
      {showLine && <Line />}
      {props.customComponent ? (
        <Components {...props} writeChapter={writeChapter} />
      ) : null}
      {props.fields ? (
        <>
          <SelectSetFieldGroupData
            {...props}
            writeChapter={writeChapter.current}
            deleteHandler={deleteHandler}
            addOrRemove={addOrRemove}
          />
          {!!props.addButton && props.repeat && writeChapter.current ? (
            <DepthButton
              iconProps={{ icon: ["far", "plus"], className: "text-secondary" }}
              type="button"
              onClick={() => addHandler()}
              className="mb-3 w-100"
            >
              {props.addButton ? props.addButton : "Add"}
            </DepthButton>
          ) : null}
        </>
      ) : props.type === "files" ? (
        <>
          <Input
            {...props}
            noComment
            // noComment={readMf}
            // TinyButtons={
            //   readMf ? (
            //     <TinyButton color="primary" onClick={onEditMf}>
            //       Edit
            //     </TinyButton>
            //   ) : (
            //     <div className="d-none d-sm-inline">
            //       <TinyButton color="success" onClick={onSubmitMf}>
            //         Submit
            //       </TinyButton>
            //       <TinyButton color="secondary" onClick={onCancelMf}>
            //         Cancel
            //       </TinyButton>
            //     </div>
            //   )
            // }
            // BigButtons={
            //   !readMf && (
            //     <div className="d-flex d-sm-none my-1">
            //       <Button
            //         className="w-100 m-0 px-0 text-light"
            //         variant="success"
            //         onClick={onSubmitMf}
            //       >
            //         <FontAwesomeIcon icon="check" style={{ width: "1.5em" }} />
            //         Submit
            //       </Button>
            //       <div className="px-1" />
            //       <Button
            //         className="w-100 m-0 px-0"
            //         variant="secondary"
            //         onClick={onCancelMf}
            //       >
            //         <FontAwesomeIcon icon="times" style={{ width: "1.5em" }} />
            //         Cancel
            //       </Button>
            //     </div>
            //   )
            // }
            writeChapter={writeChapter.current}
          />
        </>
      ) : null}
      {(editAllActive || finalChapterActive) && <SubmitAndCancel />}
    </div>
  );
});
