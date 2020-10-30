import React, {
  useEffect,
  useContext,
  useCallback,
  useState,
  Fragment,
  useMemo,
  useLayoutEffect
} from "react";
import { ChapterContext, DocumentDataContext } from "components/form/Form";
import Title from "components/design/fonts/Title";
import {
  getRepeatNumber,
  isNumberAndNotNaN,
  writeChapter,
  getProperties,
  variableLabel,
  getRepeatStepList,
  isLastCharacterNumber,
  notShowSpec
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
import useHidden from "hooks/useHidden";

export default React.memo(
  ({
    allData,
    backendData,
    optionsData,
    submitData,
    document,
    edit,
    specData,
    jsonVariables,
    stage,
    repeatStepList,
    path,
    thisChapter,
    stopLoop,
    showEditButton,
    indexId,
    index,
    noSaveButton,
    finalChapterRef,
    showSubmitButton,
    itemIdsRef,
    itemId,
    specRemovePath,
    writeOnlyFieldIf,
    repeatGroupWithQuerySpecData,
    customComponent,
    notSubmitButton,
    noLine,
    className,
    fields,
    addButton,
    label,
    prepend,
    queryPath,
    showPage,
    showPageSpecPath,
    editRepeatStepValueList,
    repeatGroupWithQuery,
    repeatGroupWithQueryMath,
    editRepeatStepListRepeat,
    allWaysShow,
    repeatStartWith,
    pageTitle,
    indexVariablePageTitle,
    type,
    variableLabelSpec,
    editRepeatStepListVariableLabel,
    queryVariableLabel,
    indexVariableLabel,
    delete: deleteButton
  }) => {
    const { finalChapter, editChapter, setEditChapter } = useContext(
      ChapterContext
    );
    if (finalChapterRef && finalChapterRef > finalChapter.current) {
      finalChapter.current = finalChapterRef;
    }

    const DeleteButton = ({ index, deleteHandler }) => (
      <DepthButton
        iconProps={{ icon: ["fas", "trash-alt"], className: "text-danger" }}
        onClick={() => deleteHandler(index)}
        className="w-100 mt-1 mb-3"
      >
        Remove
      </DepthButton>
    );

    const multiFieldGroup = useCallback(
      (index, deleteHandler, editChapter, finalChapter, hidden) => {
        return (
          <Fragment
            key={`${repeatStepList}-${index}-${path}-${queryPath}-fragment`}
          >
            {pageTitle && indexVariablePageTitle !== undefined ? (
              <>
                <Subtitle
                  className={
                    !writeChapter(
                      allWaysShow,
                      editChapter,
                      thisChapter,
                      finalChapter.current
                    ) && "mt-3"
                  }
                >
                  {variableLabel(
                    getProperties(pageTitle, jsonVariables),
                    getProperties(variableLabelSpec, jsonVariables)
                      ? specData
                      : document.current,
                    getProperties(queryVariableLabel, jsonVariables),
                    repeatStepList,
                    editRepeatStepListVariableLabel,
                    getProperties(indexVariableLabel, jsonVariables)
                      ? repeatStepList &&
                          repeatStepList[repeatStepList.length - 1]
                      : undefined
                  )}
                </Subtitle>
                <Line></Line>
              </>
            ) : null}
            <FieldGroup
              fields={fields}
              allData={allData}
              backendData={backendData}
              optionsData={optionsData}
              submitData={submitData}
              document={document}
              edit={edit}
              specData={specData}
              jsonVariables={jsonVariables}
              stage={stage}
              thisChapter={thisChapter}
              stopLoop={stopLoop}
              index={index}
              itemIdsRef={itemIdsRef}
              itemId={itemId}
              specRemovePath={specRemovePath}
              writeOnlyFieldIf={writeOnlyFieldIf}
              queryPath={queryPath}
              editRepeatStepValueList={editRepeatStepValueList}
              repeatGroupWithQuery={repeatGroupWithQuery}
              repeatGroupWithQueryMath={repeatGroupWithQueryMath}
              editRepeatStepListRepeat={editRepeatStepListRepeat}
              repeatStepList={getRepeatStepList(repeatStepList, index)}
              repeatStep={index}
              path={path ? `${path}.${index}` : null}
              file={
                objectPath.get(
                  backendData,
                  path ? `${path}.${index}.data` : null
                ) &&
                objectPath.get(
                  backendData,
                  path ? `${path}.${index}.data` : null
                ).file
              }
              indexId={`${indexId}-${index}`}
            />
            {!!deleteButton &&
              !hidden &&
              !!writeChapter(
                allWaysShow,
                editChapter,
                thisChapter,
                finalChapter.current
              ) &&
              (repeatStartWith ? (
                !!index && (
                  <DeleteButton index={index} deleteHandler={deleteHandler} />
                )
              ) : (
                <DeleteButton index={index} deleteHandler={deleteHandler} />
              ))}
          </Fragment>
        );
      },
      [
        allData,
        allWaysShow,
        backendData,
        deleteButton,
        document,
        edit,
        editRepeatStepListRepeat,
        editRepeatStepValueList,
        fields,
        indexId,
        indexVariablePageTitle,
        itemId,
        itemIdsRef,
        jsonVariables,
        optionsData,
        pageTitle,
        path,
        queryPath,
        repeatGroupWithQuery,
        repeatGroupWithQueryMath,
        repeatStartWith,
        repeatStepList,
        specData,
        specRemovePath,
        stage,
        stopLoop,
        submitData,
        thisChapter,
        writeOnlyFieldIf
      ]
    );
    const {
      documentDataDispatch,
      documentData,
      renderFunction,
      screenshotData
    } = useContext(DocumentDataContext);
    const [fieldGroups, setFieldGroups] = useState({});
    const hidden = useHidden(writeOnlyFieldIf, [
      `${label}-${prepend}-${queryPath}-page-hidden`
    ]);

    const updateReadOnly = useCallback(() => {
      if (
        typeof writeOnlyFieldIf === "object" &&
        writeOnlyFieldIf !== null &&
        !(writeOnlyFieldIf instanceof Array)
      ) {
        let key = Object.keys(writeOnlyFieldIf)[0];
        let value = objectPath.get(documentData.current, key, undefined);
        return value === undefined
          ? true
          : !writeOnlyFieldIf[key].includes(value);
      } else {
        return !objectPath.get(documentData.current, writeOnlyFieldIf, false);
      }
    }, [writeOnlyFieldIf, documentData]);

    const deleteData = useCallback(
      index => {
        documentDataDispatch({
          type: "delete",
          path: `${path}.${index}`,
          notReRender: true
        });
      },
      [path, documentDataDispatch]
    );
    const deleteHandler = useCallback(
      index => {
        setFieldGroups(prevState => {
          delete prevState[
            `${repeatStepList}-${index}-${path}-${queryPath}-fragment`
          ];
          return { ...prevState };
        });
        deleteData(index);
      },
      [deleteData, path, setFieldGroups, queryPath, repeatStepList]
    );
    useEffect(() => {
      let temporaryMultiFieldGroup = {};
      if (
        (showPage === undefined ||
          (showPage && getProperties(showPage, jsonVariables))) &&
        !notShowSpec(
          specData,
          showPageSpecPath,
          repeatStepList,
          editRepeatStepValueList
        )
      ) {
        if (repeatGroupWithQuery || repeatGroupWithQueryMath || addButton) {
          let arrayData = objectPath.get(documentData.current, path);
          if (Array.isArray(arrayData)) {
            for (let index = 0; index < arrayData.length; index++) {
              temporaryMultiFieldGroup[
                `${repeatStepList}-${index}-${path}-${queryPath}-fragment`
              ] = multiFieldGroup(
                index,
                deleteHandler,
                editChapter,
                finalChapter,
                hidden
              );
            }
          } else if (!queryPath) {
            let repeatNumber = getRepeatNumber(
              specData,
              repeatGroupWithQuery,
              repeatGroupWithQueryMath,
              repeatStepList,
              editRepeatStepListRepeat
            );
            for (let index = 0; index < repeatNumber; index++) {
              temporaryMultiFieldGroup[
                `${repeatStepList}-${index}-${path}-${queryPath}-fragment`
              ] = (
                <FieldGroup
                  fields={fields}
                  allData={allData}
                  backendData={backendData}
                  optionsData={optionsData}
                  submitData={submitData}
                  document={document}
                  edit={edit}
                  specData={specData}
                  jsonVariables={jsonVariables}
                  stage={stage}
                  thisChapter={thisChapter}
                  stopLoop={stopLoop}
                  index={index}
                  itemIdsRef={itemIdsRef}
                  itemId={itemId}
                  specRemovePath={specRemovePath}
                  writeOnlyFieldIf={writeOnlyFieldIf}
                  queryPath={queryPath}
                  editRepeatStepValueList={editRepeatStepValueList}
                  repeatGroupWithQuery={repeatGroupWithQuery}
                  repeatGroupWithQueryMath={repeatGroupWithQueryMath}
                  editRepeatStepListRepeat={editRepeatStepListRepeat}
                  key={`${path}.${repeatGroupWithQuery}.${index}`}
                  repeatStepList={getRepeatStepList(repeatStepList, index)}
                  repeatStep={index}
                  path={path ? `${path}.${index}.data` : null}
                  indexId={`${indexId}-${index}`}
                />
              );
            }
          }
        } else {
          temporaryMultiFieldGroup[
            `${repeatStepList}-0-${path}-${queryPath}-fragment`
          ] = (
            <FieldGroup
              fields={fields}
              allData={allData}
              backendData={backendData}
              optionsData={optionsData}
              submitData={submitData}
              document={document}
              edit={edit}
              specData={specData}
              jsonVariables={jsonVariables}
              stage={stage}
              thisChapter={thisChapter}
              stopLoop={stopLoop}
              index={index}
              itemIdsRef={itemIdsRef}
              itemId={itemId}
              specRemovePath={specRemovePath}
              writeOnlyFieldIf={writeOnlyFieldIf}
              queryPath={queryPath}
              editRepeatStepValueList={editRepeatStepValueList}
              repeatGroupWithQuery={repeatGroupWithQuery}
              repeatGroupWithQueryMath={repeatGroupWithQueryMath}
              editRepeatStepListRepeat={editRepeatStepListRepeat}
              key={`${path}.${queryPath}`}
              repeatStepList={getRepeatStepList(repeatStepList, 0)}
              file={
                objectPath.get(backendData, path + ".data") &&
                objectPath.get(backendData, path + ".data").file
              }
              path={
                path ? (isLastCharacterNumber(path) ? path : `${path}`) : null
              }
              repeatStep={0}
              indexId={`${indexId}`}
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
      allData,
      allWaysShow,
      backendData,
      deleteButton,
      document,
      edit,
      editRepeatStepListRepeat,
      editRepeatStepValueList,
      fields,
      indexId,
      indexVariablePageTitle,
      itemId,
      itemIdsRef,
      jsonVariables,
      optionsData,
      pageTitle,
      addButton,
      path,
      queryPath,
      repeatGroupWithQuery,
      repeatGroupWithQueryMath,
      repeatStartWith,
      repeatStepList,
      specData,
      specRemovePath,
      stage,
      stopLoop,
      submitData,
      thisChapter,
      writeOnlyFieldIf,
      index,
      multiFieldGroup,
      showPage,
      showPageSpecPath,
      documentData,
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
            [`${repeatStepList}-${pushOnIndex}-${path}-${queryPath}-fragment`]: multiFieldGroup(
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
          path: `${path}.${pushOnIndex}`,
          notReRender: true
        });
      },
      [
        multiFieldGroup,
        path,
        queryPath,
        repeatStepList,
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
        objectPath.get(documentData.current, path) === undefined
          ? 0
          : objectPath.get(documentData.current, path).length;
      setFieldGroups(prevState => {
        return {
          ...prevState,
          [`${repeatStepList}-${index}-${path}-${queryPath}-fragment`]: multiFieldGroup(
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
        path: `${path}.${index}`,
        notReRender: true
      });
    }, [
      repeatStepList,
      path,
      queryPath,
      documentDataDispatch,
      documentData,
      multiFieldGroup,
      setFieldGroups,
      deleteHandler,
      editChapter,
      finalChapter,
      hidden
    ]);
    // If number of repeat group decided by a another field, it sets repeatGroup
    const autoRepeat = useCallback(() => {
      let newValue = getRepeatNumber(
        repeatGroupWithQuerySpecData ? specData : documentData.current,
        repeatGroupWithQuery,
        repeatGroupWithQueryMath,
        repeatStepList,
        editRepeatStepListRepeat
      );
      let oldValue = objectPath.get(documentData.current, path, false);
      let temporaryMultiFieldGroup = {};
      oldValue = oldValue ? (oldValue.length ? oldValue.length : 0) : 0;
      if (oldValue < newValue) {
        for (let i = oldValue; i < newValue; i++) {
          // temporaryMultiFieldGroup[
          //   `${repeatStepList}-${i}-${path}-${queryPath}-fragment`
          // ] = multiFieldGroup(
          //   props,
          //   i,
          //   deleteHandler,
          //   editChapter,
          //   finalChapter,
          //   hidden
          // );
          addData(i);
        }
      } else if (newValue < oldValue) {
        for (let i = oldValue - 1; i > newValue - 1; i--) {
          temporaryMultiFieldGroup[
            `${repeatStepList}-${i}-${path}-${queryPath}-fragment`
          ] = null;
          deleteData(i);
        }
      }
      setFieldGroups(prevState => {
        return { ...prevState, ...temporaryMultiFieldGroup };
      });
    }, [
      repeatGroupWithQuerySpecData,
      specData,
      queryPath,
      documentData,
      repeatGroupWithQuery,
      repeatGroupWithQueryMath,
      repeatStepList,
      editRepeatStepListRepeat,
      path,
      addData,
      setFieldGroups,
      deleteData
    ]);

    useLayoutEffect(() => {
      if (
        (repeatGroupWithQuery || repeatGroupWithQueryMath) &&
        !repeatGroupWithQuerySpecData &&
        writeChapter(
          allWaysShow,
          editChapter,
          thisChapter,
          finalChapter.current
        ) &&
        (showPage === undefined ||
          (showPage && getProperties(showPage, jsonVariables))) &&
        !notShowSpec(
          specData,
          showPageSpecPath,
          repeatStepList,
          editRepeatStepValueList
        )
      ) {
        renderFunction.current[`${path}-Page`] = autoRepeat;
      }
      return () => {
        if (renderFunction.current[`${path}-Page`]) {
          // eslint-disable-next-line
          delete renderFunction.current[`${path}-Page`];
        }
      };
    }, [
      finalChapter,
      showPage,
      jsonVariables,
      repeatGroupWithQuery,
      repeatGroupWithQueryMath,
      path,
      editRepeatStepListRepeat,
      repeatGroupWithQuerySpecData,
      editChapter,
      allWaysShow,
      thisChapter,
      autoRepeat,
      renderFunction,
      specData,
      showPageSpecPath,
      repeatStepList,
      editRepeatStepValueList
    ]);

    useEffect(() => {
      if (
        (repeatGroupWithQuery || repeatGroupWithQueryMath) &&
        writeChapter(
          allWaysShow,
          editChapter,
          thisChapter,
          finalChapter.current
        ) &&
        (showPage === undefined ||
          (showPage && getProperties(showPage, jsonVariables))) &&
        !notShowSpec(
          specData,
          showPageSpecPath,
          repeatStepList,
          editRepeatStepValueList
        ) &&
        queryPath
      ) {
        autoRepeat();
      }
    }, [
      queryPath,
      finalChapter,
      showPage,
      repeatGroupWithQueryMath,
      jsonVariables,
      editChapter,
      showPageSpecPath,
      allWaysShow,
      thisChapter,
      backendData,
      autoRepeat,
      specData,
      repeatGroupWithQuery,
      repeatGroupWithQuerySpecData,
      documentData,
      repeatStepList,
      editRepeatStepValueList
    ]);

    if (
      objectPath.get(documentData.current, path, null) === null &&
      objectPath.get(backendData, path, null) === null &&
      !isNumberAndNotNaN(Number(path.split(".")[path.split(".").length - 1]))
    ) {
      documentDataDispatch({
        type: "add",
        notReRender: true,
        newState:
          repeatGroupWithQuery || repeatGroupWithQueryMath || addButton
            ? []
            : {},
        path: path
      });
    }

    if (
      repeatStartWith &&
      getProperties(repeatStartWith, jsonVariables) &&
      writeChapter(
        allWaysShow,
        editChapter,
        thisChapter,
        finalChapter.current
      ) &&
      !notShowSpec(
        specData,
        showPageSpecPath,
        repeatStepList,
        editRepeatStepValueList
      ) &&
      (!objectPath.get(backendData, path) ||
        objectPath.get(backendData, path).length === 0) &&
      (objectPath.get(documentData.current, path) === undefined ||
        (Array.isArray(objectPath.get(documentData.current, path)) &&
          objectPath.get(documentData.current, path).length === 0))
    ) {
      let temporaryMultiFieldGroup = {};
      for (
        let index = 0;
        index < getProperties(repeatStartWith, jsonVariables);
        index++
      ) {
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
      () => CustomComponents[getProperties(customComponent, jsonVariables)],
      [customComponent, jsonVariables]
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
      submitData(false);
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
      documentDataDispatch({ type: "setState", newState: backendData });
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
                      submitData(false);
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
          {!notSubmitButton && <SubmitButton />}
          {finalChapterActive && !noSaveButton && <SaveButton />}
          {showCancel && <CancelButton />}
        </DepthButtonGroup>
      );
    };
    // Checks for conditional rendering
    const showEditAll =
      showEditButton &&
      !stopLoop &&
      !writeChapter(
        allWaysShow,
        editChapter,
        thisChapter,
        finalChapter.current
      ) &&
      edit;
    // && thisChapter !== finalChapterRef;
    const showTitle =
      !stopLoop && pageTitle && indexVariablePageTitle === undefined;
    const showLine =
      (showTitle || showEditAll) &&
      !noLine &&
      !!pageTitle &&
      !["", " "].includes(pageTitle);
    const showCancel = !!editChapter;
    const showCancelTab =
      showLine &&
      !!editChapter &&
      thisChapter !== finalChapter.current &&
      pageTitle;
    const editAllActive =
      showSubmitButton && editChapter && thisChapter === editChapter;
    const finalChapterActive =
      showSubmitButton && !editChapter && thisChapter === finalChapter.current;
    const finalPage = showSubmitButton;

    // MultipleFiles logic
    // TODO: Make functions for these variables
    // const readMf = true;
    // const onEditMf = () => {};
    // const onSubmitMf = () => {};
    // const onCancelMf = () => {};

    return (
      <div
        className={`${finalPage && "mb-5"} ${className} `}
        // className={`${ !finalChapter && "" } ${ className } `}
      >
        <div className="d-flex justify-content-between align-items-end">
          {showTitle ? (
            <Title>
              {variableLabel(
                getProperties(pageTitle, jsonVariables),
                getProperties(variableLabelSpec, jsonVariables)
                  ? specData
                  : document.current,
                getProperties(queryVariableLabel, jsonVariables),
                repeatStepList,
                editRepeatStepListVariableLabel,
                getProperties(indexVariableLabel, jsonVariables)
                  ? repeatStepList && repeatStepList[repeatStepList.length - 1]
                  : undefined
              )}
            </Title>
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
                          submitData(false);
                          documentDataDispatch({
                            type: "setState",
                            newState: backendData
                          });
                          setEditChapter(thisChapter);
                        }
                      },
                      {
                        label: "Discard and continue",
                        variant: "danger",

                        onClick: () => {
                          documentDataDispatch({
                            type: "setState",
                            newState: backendData
                          });
                          setEditChapter(thisChapter);
                        }
                      }
                    ]
                  });
                } else {
                  documentDataDispatch({
                    type: "setState",
                    newState: backendData
                  });
                  setEditChapter(thisChapter);
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
                            submitData(false);
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
        {!!Components && (
          <Components
            allData={allData}
            backendData={backendData}
            optionsData={optionsData}
            submitData={submitData}
            document={document}
            edit={edit}
            specData={specData}
            jsonVariables={jsonVariables}
            stage={stage}
            thisChapter={thisChapter}
            stopLoop={stopLoop}
            index={index}
            finalChapter={finalChapter}
            itemIdsRef={itemIdsRef}
            itemId={itemId}
            specRemovePath={specRemovePath}
            writeOnlyFieldIf={writeOnlyFieldIf}
            queryPath={queryPath}
            editRepeatStepValueList={editRepeatStepValueList}
            repeatGroupWithQuery={repeatGroupWithQuery}
            repeatGroupWithQueryMath={repeatGroupWithQueryMath}
            editRepeatStepListRepeat={editRepeatStepListRepeat}
            repeatStepList={getRepeatStepList(repeatStepList, index)}
            repeatStep={index}
            path={path ? `${path}.${index}` : null}
            file={
              objectPath.get(
                backendData,
                path ? `${path}.${index}.data` : null
              ) &&
              objectPath.get(backendData, path ? `${path}.${index}.data` : null)
                .file
            }
            indexId={`${indexId}-${index}`}
          />
        )}
        {fields ? (
          <>
            {Object.values(fieldGroups)}
            {!!addButton &&
            (repeatGroupWithQuery || repeatGroupWithQueryMath || addButton) &&
            !updateReadOnly() &&
            (showPage === undefined ||
              (showPage && getProperties(showPage, jsonVariables))) &&
            !notShowSpec(
              specData,
              showPageSpecPath,
              repeatStepList,
              editRepeatStepValueList
            ) &&
            writeChapter(
              allWaysShow,
              editChapter,
              thisChapter,
              finalChapter.current
            ) ? (
              <DepthButton
                iconProps={{
                  icon: ["far", "plus"],
                  className: "text-secondary"
                }}
                type="button"
                onClick={() => addHandler()}
                className="mb-3 w-100"
              >
                {addButton ? addButton : "Add"}
              </DepthButton>
            ) : null}
          </>
        ) : type === "files" ? (
          <>
            <Input
              noComment
              label={label}
              prepend={prepend}
              path={path}
              fields={fields}
              type={type}
              allData={allData}
              backendData={backendData}
              optionsData={optionsData}
              submitData={submitData}
              document={document}
              edit={edit}
              specData={specData}
              jsonVariables={jsonVariables}
              stage={stage}
              thisChapter={thisChapter}
              stopLoop={stopLoop}
              index={index}
              itemIdsRef={itemIdsRef}
              itemId={itemId}
              specRemovePath={specRemovePath}
              writeOnlyFieldIf={writeOnlyFieldIf}
              queryPath={queryPath}
              editRepeatStepValueList={editRepeatStepValueList}
              repeatGroupWithQuery={repeatGroupWithQuery}
              repeatGroupWithQueryMath={repeatGroupWithQueryMath}
              editRepeatStepListRepeat={editRepeatStepListRepeat}
              repeatStep={index}
            />
          </>
        ) : null}
        {(editAllActive || finalChapterActive) && <SubmitAndCancel />}
      </div>
    );
  }
);
