import React, {
  useEffect,
  useContext,
  useLayoutEffect,
  useCallback,
  useState,
  Fragment
} from "react";
import { ChapterContext, documentDataContext } from "components/form/Form";
import Title from "components/design/fonts/Title";
import { getRepeatNumber, isNumberAndNotNaN, writeOrReadChapter, variableString, getRepeatStepList, isLastCharacterNumber } from "functions/general";
import objectPath from "object-path";
import CustomComponents from "components/form/components/CustomElement";
import Line from "components/design/Line";
import TabButton from "components/button/TabButton";
import FieldGroup from "components/form/components/fields/FieldGroup";
import DepthButton from "components/button/DepthButton";
import DepthButtonGroup from "components/button/DepthButtonGroup";
import Subtitle from "components/design/fonts/Subtitle";
import Input from "components/input/Input";
import { dialog } from "components/Dialog";

const DeleteButton = ({ index, deleteHandler }) => (
  <DepthButton
    iconProps={{ icon: ["fas", "trash-alt"], className: "text-danger" }}
    onClick={() => deleteHandler(index)}
    className="w-100 mt-1 mb-3"
  >
    Remove
  </DepthButton>
);

const multiFieldGroup = (props, index, deleteHandler, editChapter, finalChapter) => {
  return (<Fragment key={`${index}-${props.path}-${props.queryPath}-repeat-fragment`}>
    {props.pageTitle && props.indexVariablePageTitle !== undefined ? (
      <>
        <Subtitle className={!writeOrReadChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter) && "mt-3"}>
          {variableString(index + 1, props.pageTitle)}
        </Subtitle>
        <Line></Line>
      </>
    ) : null}
    <FieldGroup
      {...props}
      repeatStepList={getRepeatStepList(props.repeatStepList, index)}
      repeatStep={index}
      path={props.path ? `${props.path}.${index}` : null}
      file={
        objectPath.get(
          props.backendData,
          props.path ? `${props.path}.${index}.data` : null
        ) &&
        objectPath.get(
          props.backendData,
          props.path ? `${props.path}.${index}.data` : null
        ).file
      }
      indexId={`${props.indexId}-${index}`}
    />
    {!!props.delete && !!writeOrReadChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter) && (
      props.repeatStartWithOneGroup ? (
        !!index && (
          <DeleteButton
            index={index}
            deleteHandler={deleteHandler}
          />
        )
      ) : (
          <DeleteButton
            index={index}
            deleteHandler={deleteHandler}
          />
        )
    )}
  </Fragment>
  );
}




export default React.memo(props => {
  const {
    setFinalChapter,
    finalChapter,
    editChapter,
    setEditChapter
  } = useContext(ChapterContext);
  const {
    documentDataDispatch,
    documentData,
    renderFunction,
    dataChange,
    setDataChange,
    unchangedData
  } = useContext(documentDataContext);
  const [fieldGroups, setFieldGroups] = useState({})

  if (props.finalChapter && props.finalChapter !== finalChapter) {
    setFinalChapter(props.finalChapter);
  }

  const deleteData = useCallback(
    index => {
      documentDataDispatch({
        type: "delete",
        path: `${props.path}.${index}`,
        notReRender: true,
        // resetRenderFunction: true
      });
    },
    [
      props.path,
      documentDataDispatch
    ])
  const deleteHandler = useCallback(
    index => {
      setFieldGroups(prevState => {
        delete prevState[`${props.path}.${index}`]
        return { ...prevState }
      })

      deleteData(index)
    },
    [
      deleteData,
      props.path,
      setFieldGroups
    ])

  useEffect(() => {

    let temporaryMultiFieldGroup = {}
    if (props.repeat) {
      let arrayData = objectPath.get(props.backendData, props.path)
      if (
        Array.isArray(arrayData)
      ) {
        for (let index = 0; index < arrayData.length; index++) {
          temporaryMultiFieldGroup[`${index}-${props.path}-${props.queryPath}-repeat-fragment`] = multiFieldGroup(props, index, deleteHandler, editChapter, finalChapter)
        }

      } else if (!props.queryPath) {
        let repeatNumber = getRepeatNumber(
          props.specData,
          props.repeatGroupWithQuery,
          props.repeatStepList,
          props.editRepeatStepListRepeat
        );
        for (let index = 0; index < repeatNumber; index++) {
          temporaryMultiFieldGroup[`${props.path}.${props.repeatGroupWithQuery}.${index}`] = (
            <FieldGroup
              key={`${props.path}.${props.repeatGroupWithQuery}.${index}`}
              {...props}
              repeatStepList={getRepeatStepList(props.repeatStepList, index)}
              repeatStep={index}
              path={props.path ? `${props.path}.${index}.data` : null}
              indexId={`${props.indexId}-${index}`}
            />
          );
        }
      }
    } else {
      temporaryMultiFieldGroup[`${props.path}.${props.queryPath}`] = (
        <FieldGroup
          {...props}
          key={`${props.path}.${props.queryPath}`}
          repeatStepList={getRepeatStepList(props.repeatStepList, 0)}
          file={
            objectPath.get(props.backendData, props.path + ".0.data") &&
            objectPath.get(props.backendData, props.path + ".0.data").file
          }
          path={
            props.path
              ? isLastCharacterNumber(props.path)
                ? props.path
                : `${props.path}.0`
              : null
          }
          repeatStep={0}
          indexId={`${props.indexId}-0`}
        />
      );
    }
    if (Object.keys(temporaryMultiFieldGroup).length) {
      setFieldGroups(prevState => {
        return { ...prevState, ...temporaryMultiFieldGroup }
      })
    }

  }, [props.backendData, props, deleteHandler, setFieldGroups, editChapter, finalChapter])

  const addData = useCallback(
    pushOnIndex => {
      setFieldGroups(prevState => {
        return { ...prevState, [`${pushOnIndex}-${props.path}-${props.queryPath}-repeat-fragment`]: multiFieldGroup(props, pushOnIndex, deleteHandler, editChapter, finalChapter) }
      })
      documentDataDispatch({
        type: "add",
        newState: {},
        fieldName: "data",
        path: `${props.path}.${pushOnIndex}`,
        notReRender: true
      });
    },
    [props, documentDataDispatch, setFieldGroups, deleteHandler, editChapter, finalChapter]
  );

  const addHandler = useCallback(() => {
    let index = objectPath.get(documentData.current, props.path) === undefined ? 0 : objectPath.get(documentData.current, props.path).length
    setFieldGroups(prevState => {
      return { ...prevState, [`${index}-${props.path}-${props.queryPath}-repeat-fragment`]: multiFieldGroup(props, index, deleteHandler, editChapter, finalChapter) }
    })

    documentDataDispatch({
      type: "add",
      newState: {},
      fieldName: "data",
      path: `${props.path}.${index}`,
      notReRender: true
    });

  }, [documentDataDispatch, documentData, props, setFieldGroups, deleteHandler, editChapter, finalChapter]);

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
      let temporaryMultiFieldGroup = {}
      if (oldValueLength < newValue) {
        for (let i = oldValueLength; i < newValue; i++) {
          temporaryMultiFieldGroup[`${i}-${props.path}-${props.queryPath}-repeat-fragment`] = multiFieldGroup(props, i, deleteHandler, editChapter, finalChapter)
          addData(i);
        }
      } else if (newValue < oldValueLength) {
        for (let i = oldValueLength - 1; i > newValue - 1; i--) {
          temporaryMultiFieldGroup[`${i}-${props.path}-${props.queryPath}-repeat-fragment`] = null
          deleteData(i);
        }
      }
      setFieldGroups(prevState => {
        return { ...prevState, ...temporaryMultiFieldGroup }
      })
    },
    [
      deleteHandler,
      props,
      documentData,
      addData,
      setFieldGroups,
      deleteData,
      editChapter,
      finalChapter
    ]
  );
  useEffect(() => {


    if (
      props.repeatGroupWithQuery &&
      !props.repeatGroupWithQuerySpecData &&
      writeOrReadChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter)
    ) {
      renderFunction.current[`${props.path}-Page`] = autoRepeat;
    }
    return () => {
      if (renderFunction.current[`${props.path}-Page`]) {
        // TODO: Implement correctly by eslint standard
        // Note: The ref value is supposed to change before the cleanup function (regarding eslint warning)
        // eslint-disable-next-line
        delete renderFunction.current[`${props.path}-Page`];
      }
    };
  }, [
    props.repeatGroupWithQuery,
    props.path,
    props.editRepeatStepListRepeat,
    props.repeatGroupWithQuerySpecData,
    editChapter,
    finalChapter,
    props.allWaysShow,
    props.thisChapter,
    autoRepeat,
    renderFunction
  ]);

  useEffect(() => {

    if (props.repeatGroupWithQuery && writeOrReadChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter)) {
      if (!props.repeatGroupWithQuerySpecData) {
        autoRepeat(
          Object.keys(documentData.current).length === 0
            ? props.backendData
            : documentData.current
        );
      } else if (props.repeatGroupWithQuerySpecData) {
        autoRepeat(props.specData);
      }
    }
  }, [
    editChapter,
    finalChapter,
    props.allWaysShow,
    props.thisChapter,
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
    writeOrReadChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter) &&
    (!objectPath.get(props.backendData, props.path) ||
      objectPath.get(props.backendData, props.path).length === 0) &&
    (objectPath.get(documentData.current, props.path) === undefined || (Array.isArray(objectPath.get(documentData.current, props.path)) &&
      objectPath.get(documentData.current, props.path).length === 0))
  ) {
    if (!fieldGroups[`${props.path}.${0}`]) {
      setFieldGroups(prevState => {
        return { ...prevState, [`${0}-${props.path}-${props.queryPath}-repeat-fragment`]: multiFieldGroup(props, 0, deleteHandler, editChapter, finalChapter) }
      })
    }
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
    documentDataDispatch({ type: "setState", newState: props.backendData });
    setEditChapter(0);
  };

  const CancelButton = () => {
    return (
      <DepthButton
        iconProps={{ icon: ["fas", "times"], className: "text-secondary" }}
        short
        onClick={() => {
          if (unsavedChanges) {
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
                    setDataChange(false);
                    cancel();
                  }
                }
              ]
            });
          } else {
            setDataChange(false);
            cancel();
          }
        }}
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
    !writeOrReadChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter) &&
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

  const unsavedChanges =
    dataChange &&
    JSON.stringify(unchangedData) !== JSON.stringify(documentData.current);

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
              if (unsavedChanges) {
                dialog({
                  message: "Do you want to save your changes?",
                  buttons: [
                    {
                      label: "Save and continue",
                      variant: "success",
                      type: "submit",
                      onClick: () => {
                        props.submitData(documentData.current, false);

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
                        documentDataDispatch({
                          type: "setState",
                          newState: props.backendData
                        });
                        setEditChapter(props.thisChapter);
                      }
                    }
                  ]
                });
              } else {
                documentDataDispatch({
                  type: "setState",
                  newState: props.backendData
                });
                setEditChapter(props.thisChapter);
              }
            }}
          >
            Edit all
          </TabButton>
        ) : (
            showCancelTab && (
              <TabButton
                onClick={() => {
                  if (unsavedChanges) {
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
                            setDataChange(false);
                            cancel();
                          }
                        }
                      ]
                    });
                  } else {
                    setDataChange(false);
                    cancel();
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
        <Components {...props} />
      ) : null}
      {props.fields ? (
        <>
          {Object.values(fieldGroups)}
          {!!props.addButton && props.repeat && writeOrReadChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter) ? (
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
          />
        </>
      ) : null}
      {(editAllActive || finalChapterActive) && <SubmitAndCancel />}
    </div>
  );
});
