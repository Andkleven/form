import React, {
  useEffect,
  useContext,
  useCallback,
  useState,
  Fragment,
  useMemo
} from "react";
import { ChapterContext, DocumentDataContext } from "components/form/Form";
import Title from "components/design/fonts/Title";
import {
  getRepeatNumber,
  isNumberAndNotNaN,
  writeChapter,
  getProperties,
  variableString,
  getRepeatStepList,
  isLastCharacterNumber
} from "functions/general";
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
import useHidden from "functions/useHidden";

const DeleteButton = ({ index, deleteHandler }) => (
  <DepthButton
    iconProps={{ icon: ["fas", "trash-alt"], className: "text-danger" }}
    onClick={() => deleteHandler(index)}
    className="w-100 mt-1 mb-3"
  >
    Remove
  </DepthButton>
);

const multiFieldGroup = (
  props,
  index,
  deleteHandler,
  editChapter,
  finalChapter,
  hidden
) => {
  return (
    <Fragment
      key={`${props.repeatStepList}-${index}-${props.path}-${props.queryPath}-repeat-fragment`}
    >
      {props.pageTitle && props.indexVariablePageTitle !== undefined ? (
        <>
          <Subtitle
            className={
              !writeChapter(
                props.allWaysShow,
                editChapter,
                props.thisChapter,
                finalChapter.current
              ) && "mt-3"
            }
          >
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
      {!!props.delete &&
        !hidden &&
        !!writeChapter(
          props.allWaysShow,
          editChapter,
          props.thisChapter,
          finalChapter.current
        ) &&
        (props.repeatStartWith ? (
          !!index && (
            <DeleteButton index={index} deleteHandler={deleteHandler} />
          )
        ) : (
          <DeleteButton index={index} deleteHandler={deleteHandler} />
        ))}
    </Fragment>
  );
};

export default React.memo(props => {
  const { finalChapter, editChapter, setEditChapter } = useContext(
    ChapterContext
  );
  const {
    documentDataDispatch,
    documentData,
    renderFunction,
    screenshotData
  } = useContext(DocumentDataContext);
  const [fieldGroups, setFieldGroups] = useState({});
  const hidden = useHidden(props.writeOnlyFieldIf, [
    `${props.label}-${props.prepend}-${props.queryPath}-page-hidden`
  ]);
  if (props.finalChapter && props.finalChapter > finalChapter.current) {
    finalChapter.current = props.finalChapter;
  }
  const updateReadOnly = useCallback(() => {
    if (
      typeof props.writeOnlyFieldIf === "object" &&
      props.writeOnlyFieldIf !== null &&
      !(props.writeOnlyFieldIf instanceof Array)
    ) {
      let key = Object.keys(props.writeOnlyFieldIf)[0];
      let value = objectPath.get(documentData.current, key, undefined);
      return value === undefined
        ? true
        : !props.writeOnlyFieldIf[key].includes(value);
    } else {
      return !objectPath.get(
        documentData.current,
        props.writeOnlyFieldIf,
        false
      );
    }
  }, [props.writeOnlyFieldIf, documentData]);

  const deleteData = useCallback(
    index => {
      documentDataDispatch({
        type: "delete",
        path: `${props.path}.${index}`,
        notReRender: true
      });
    },
    [props.path, documentDataDispatch]
  );
  const deleteHandler = useCallback(
    index => {
      setFieldGroups(prevState => {
        delete prevState[
          `${props.repeatStepList}-${index}-${props.path}-${props.queryPath}-repeat-fragment`
        ];
        return { ...prevState };
      });
      deleteData(index);
    },
    [
      deleteData,
      props.path,
      setFieldGroups,
      props.queryPath,
      props.repeatStepList
    ]
  );

  useEffect(() => {
    let temporaryMultiFieldGroup = {};
    if (
      props.showPage === undefined ||
      (props.showPage && getProperties(props.showPage, props.jsonVariables))
    ) {
      if (props.repeat) {
        let arrayData = objectPath.get(documentData.current, props.path);
        if (Array.isArray(arrayData)) {
          for (let index = 0; index < arrayData.length; index++) {
            temporaryMultiFieldGroup[
              `${props.repeatStepList}-${index}-${props.path}-${props.queryPath}-repeat-fragment`
            ] = multiFieldGroup(
              props,
              index,
              deleteHandler,
              editChapter,
              finalChapter,
              hidden
            );
          }
        } else if (!props.queryPath) {
          let repeatNumber = getRepeatNumber(
            props.specData,
            props.repeatGroupWithQuery,
            props.repeatStepList,
            props.editRepeatStepListRepeat
          );
          for (let index = 0; index < repeatNumber; index++) {
            temporaryMultiFieldGroup[
              `${props.repeatStepList}-${index}-${props.path}.${props.queryPath}-repeat-fragment`
            ] = (
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
        temporaryMultiFieldGroup[
          `${props.repeatStepList}-${props.path}.${props.queryPath}-repeat-fragment7`
        ] = (
          <FieldGroup
            {...props}
            key={`${props.path}.${props.queryPath}`}
            repeatStepList={getRepeatStepList(props.repeatStepList, 0)}
            file={
              objectPath.get(props.backendData, props.path + ".data") &&
              objectPath.get(props.backendData, props.path + ".data").file
            }
            path={
              props.path
                ? isLastCharacterNumber(props.path)
                  ? props.path
                  : `${props.path}`
                : null
            }
            repeatStep={0}
            indexId={`${props.indexId}`}
          />
        );
      }
      if (Object.keys(temporaryMultiFieldGroup).length) {
        setFieldGroups(prevState => {
          return { ...prevState, ...temporaryMultiFieldGroup };
        });
      }
    }
  }, [
    documentData,
    props,
    deleteHandler,
    setFieldGroups,
    editChapter,
    finalChapter,
    hidden
  ]);

  const addData = useCallback(
    pushOnIndex => {
      setFieldGroups(prevState => {
        return {
          ...prevState,
          [`${props.repeatStepList}-${pushOnIndex}-${props.path}-${props.queryPath}-repeat-fragment`]: multiFieldGroup(
            props,
            pushOnIndex,
            deleteHandler,
            editChapter,
            finalChapter,
            hidden
          )
        };
      });
      documentDataDispatch({
        type: "add",
        newState: {},
        fieldName: "data",
        path: `${props.path}.${pushOnIndex}`,
        notReRender: true
      });
    },
    [
      props,
      documentDataDispatch,
      setFieldGroups,
      deleteHandler,
      editChapter,
      finalChapter,
      hidden
    ]
  );

  const addHandler = useCallback(() => {
    let index =
      objectPath.get(documentData.current, props.path) === undefined
        ? 0
        : objectPath.get(documentData.current, props.path).length;
    setFieldGroups(prevState => {
      return {
        ...prevState,
        [`${props.repeatStepList}-${index}-${props.path}-${props.queryPath}-repeat-fragment`]: multiFieldGroup(
          props,
          index,
          deleteHandler,
          editChapter,
          finalChapter,
          hidden
        )
      };
    });
    documentDataDispatch({
      type: "add",
      newState: {},
      fieldName: "data",
      path: `${props.path}.${index}`,
      notReRender: true
    });
  }, [
    documentDataDispatch,
    documentData,
    props,
    setFieldGroups,
    deleteHandler,
    editChapter,
    finalChapter,
    hidden
  ]);

  // If number of repeat group decided by a another field, it sets repeatGroup
  const autoRepeat = useCallback(
    (data = documentData.current) => {
      let newValue = getRepeatNumber(
        data,
        props.repeatGroupWithQuery,
        props.repeatStepList,
        props.editRepeatStepListRepeat
      );
      newValue = newValue ? newValue : 0;
      let oldValue = objectPath.get(documentData.current, props.path, false);
      oldValue = oldValue ? oldValue.length : 0;
      let temporaryMultiFieldGroup = {};
      if (oldValue < newValue) {
        for (let i = oldValue; i < newValue; i++) {
          temporaryMultiFieldGroup[
            `${props.repeatStepList}-${i}-${props.path}-${props.queryPath}-repeat-fragment`
          ] = multiFieldGroup(
            props,
            i,
            deleteHandler,
            editChapter,
            finalChapter,
            hidden
          );
          addData(i);
        }
      } else if (newValue < oldValue) {
        for (let i = oldValue - 1; i > newValue - 1; i--) {
          temporaryMultiFieldGroup[
            `${props.repeatStepList}-${i}-${props.path}-${props.queryPath}-repeat-fragment`
          ] = null;
          deleteData(i);
        }
      }
      setFieldGroups(prevState => {
        return { ...prevState, ...temporaryMultiFieldGroup };
      });
    },
    [
      deleteHandler,
      props,
      documentData,
      addData,
      setFieldGroups,
      deleteData,
      editChapter,
      finalChapter,
      hidden
    ]
  );
  useEffect(() => {
    if (
      props.repeatGroupWithQuery &&
      !props.repeatGroupWithQuerySpecData &&
      writeChapter(
        props.allWaysShow,
        editChapter,
        props.thisChapter,
        finalChapter.current
      ) &&
      (props.showPage === undefined ||
        (props.showPage && getProperties(props.showPage, props.jsonVariables)))
    ) {
      renderFunction.current[`${props.path} -Page`] = autoRepeat;
    }
    return () => {
      if (renderFunction.current[`${props.path} -Page`]) {
        // eslint-disable-next-line
        delete renderFunction.current[`${props.path} -Page`];
      }
    };
  }, [
    props.showPage,
    props.jsonVariables,
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
    if (
      props.repeatGroupWithQuery &&
      writeChapter(
        props.allWaysShow,
        editChapter,
        props.thisChapter,
        finalChapter.current
      ) &&
      (props.showPage === undefined ||
        (props.showPage && getProperties(props.showPage, props.jsonVariables)))
    ) {
      if (!props.repeatGroupWithQuerySpecData) {
        autoRepeat(documentData.current);
      } else if (props.repeatGroupWithQuerySpecData) {
        autoRepeat(props.specData);
      }
    }
  }, [
    props.showPage,
    props.jsonVariables,
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
      newState: props.repeat ? [] : {},
      path: props.path
    });
  }

  if (
    props.repeatStartWith &&
    getProperties(props.repeatStartWith, props.jsonVariables) &&
    writeChapter(
      props.allWaysShow,
      editChapter,
      props.thisChapter,
      finalChapter.current
    ) &&
    (!objectPath.get(props.backendData, props.path) ||
      objectPath.get(props.backendData, props.path).length === 0) &&
    (objectPath.get(documentData.current, props.path) === undefined ||
      (Array.isArray(objectPath.get(documentData.current, props.path)) &&
        objectPath.get(documentData.current, props.path).length === 0))
  ) {
    let temporaryMultiFieldGroup = {};
    for (
      let index = 0;
      index < writeChapter(props.repeatStartWith, props.jsonVariables);
      index++
    ) {
      temporaryMultiFieldGroup[
        `${props.repeatStepList}-${index}-${props.path}-${props.queryPath}-repeat-fragment`
      ] = multiFieldGroup(
        props,
        index,
        deleteHandler,
        editChapter,
        finalChapter,
        hidden
      );
      addData(index);
    }
    setFieldGroups(prevState => {
      return {
        ...prevState,
        ...temporaryMultiFieldGroup
      };
    });
  }

  const Components = useMemo(
    () =>
      CustomComponents[
        getProperties(props.customComponent, props.jsonVariables)
      ],
    [props.customComponent, props.jsonVariables]
  );

  // let history = useHistory();

  const SubmitButton = () => {
    return (
      <DepthButton
        iconProps={{ icon: ["fas", "check"], className: "text-success" }}
        short
        type="submit"
        // onClick={
        //   props.exitOnSave
        //     ? () => {
        //         props.setWhen(false);
        //         history.push("/");
        //       }
        //     : () => {}
        // }
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
          if (
            screenshotData.current &&
            JSON.stringify(screenshotData.current) !==
              JSON.stringify(documentData.current)
          ) {
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
          } else {
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
    !writeChapter(
      props.allWaysShow,
      editChapter,
      props.thisChapter,
      finalChapter.current
    ) &&
    props.edit;
  // && props.thisChapter !== finalChapter.current;
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
    props.thisChapter !== finalChapter.current &&
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
      className={`${finalPage && "mb-5"} ${props.className} `}
      // className={`${ !props.finalChapter && "" } ${ props.className } `}
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
                screenshotData.current &&
                JSON.stringify(screenshotData.current) !==
                  JSON.stringify(documentData.current)
              ) {
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
                if (
                  screenshotData.current &&
                  JSON.stringify(screenshotData.current) !==
                    JSON.stringify(documentData.current)
                ) {
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
                } else {
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
      {!!Components && <Components {...props} />}
      {props.fields ? (
        <>
          {Object.values(fieldGroups)}
          {!!props.addButton &&
          props.repeat &&
          !updateReadOnly() &&
          (props.showPage === undefined ||
            (props.showPage &&
              getProperties(props.showPage, props.jsonVariables))) &&
          writeChapter(
            props.allWaysShow,
            editChapter,
            props.thisChapter,
            finalChapter.current
          ) ? (
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
          <Input {...props} noComment />
        </>
      ) : null}
      {(editAllActive || finalChapterActive) && <SubmitAndCancel />}
    </div>
  );
});
