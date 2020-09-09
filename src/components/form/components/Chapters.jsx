import React, { Fragment, useRef, useContext } from "react";
import {
  createPath,
  removeSpace,
  lowerCaseFirstLetter,
  getProperties
} from "functions/general.js";
import Page from "components/form/components/Page";
import findNextStage from "components/form/stage/findNextStage.ts";
import objectPath from "object-path";
import stagesJson from "components/form/stage/stages.json";
import { ChapterContext, DocumentDataContext } from "components/form/Form";
import SubmitButton from "components/button/SubmitButton";
import AutoScroll from "components/AutoScroll";

// import objectPath from "object-path";

export default React.memo(
  ({
    stagePath,
    backendData,
    optionsData,
    submitData,
    nextStage,
    edit,
    readOnlySheet,
    jsonVariables,
    chapterAlwaysInWrite,
    stage,
    notEditButton,
    repeatStepList,
    backButton,
    document,
    stageType,
    specData,
    saveButton,
    allData
  }) => {
    const { editChapter } = useContext(ChapterContext);
    const { documentData } = useContext(DocumentDataContext);
    const stopLoop = useRef(false); // Flips to true for last chapter with input
    let finalChapter = 0;
    let count = 0;

    const getNewChapter = (
      repeatStepListLocal,
      pageInfo,
      byStage = false,
      thisStage = ""
    ) => {
      if (
        pageInfo.showChapter === undefined ||
        (pageInfo.showChapter &&
          getProperties(pageInfo.showChapter, jsonVariables))
      ) {
        let chapter; // new chapter to add to document
        let allRequiredFieldSatisfied = false;
        if (
          (pageInfo.chapterAlwaysInWrite || chapterAlwaysInWrite) &&
          !finalChapter
        ) {
          finalChapter = count + 1;
        }
        if (stopLoop.current) {
          chapter = null;
        } else {
          allRequiredFieldSatisfied = documentData.current
            ? byStage
              ? thisStage === stage
              : !objectPath.get(
                  documentData.current,
                  createPath(pageInfo.stageQueryPath, repeatStepListLocal),
                  false
                )
            : false;
          // if now data in lookUpBy this is last chapter
          if (allRequiredFieldSatisfied) {
            stagePath.current = createPath(
              pageInfo.stageQueryPath,
              repeatStepListLocal
            );
            finalChapter = count + 1;
            if (readOnlySheet) {
              stopLoop.current = true;
            }
          }

          if (allRequiredFieldSatisfied && readOnlySheet) {
            chapter = null;
          } else {
            chapter = pageInfo.pages.map((info, index) => {
              let showEditButton = !notEditButton && !index ? true : false;
              let showSubmitButton =
                index === pageInfo.pages.length - 1 ? true : false;
              return (
                <Page
                  key={`${index}-${count}-${repeatStepListLocal}-page`}
                  {...info}
                  allData={allData}
                  stagePath={stagePath}
                  stageType={stageType}
                  backendData={backendData}
                  optionsData={optionsData}
                  submitData={submitData}
                  nextStage={nextStage}
                  edit={edit}
                  specData={specData}
                  readOnlySheet={readOnlySheet}
                  jsonVariables={jsonVariables}
                  chapterAlwaysInWrite={chapterAlwaysInWrite}
                  stage={stage}
                  saveButton={saveButton}
                  notEditButton={notEditButton}
                  repeatStepList={repeatStepListLocal}
                  backButton={backButton}
                  path={createPath(info.queryPath, repeatStepListLocal)}
                  thisChapter={count + 1}
                  stopLoop={stopLoop.current}
                  showEditButton={showEditButton}
                  indexId={`${count + 1}- ${index} `}
                  index={index}
                  noSaveButton={document.noSaveButton}
                  finalChapter={finalChapter}
                  showSubmitButton={showSubmitButton}
                />
              );
            });
          }
          // if now data in lookUpBy stop loop
          if (allRequiredFieldSatisfied) {
            stopLoop.current = true;
          }
        }
        count += 1;
        return chapter ? (
          <Fragment key={`${count}-canvas-chapterFragment`}>
            {allRequiredFieldSatisfied && !editChapter && <AutoScroll />}
            {chapter}
          </Fragment>
        ) : null;
      } else {
        count += 1;
        return null;
      }
    };
    const runChapter = (pageInfo, thisStage = "", stepsList = undefined) => {
      return (
        <Fragment key={`${count} -stageTitleSomething`}>
          {" "}
          {getNewChapter(
            stepsList !== undefined
              ? repeatStepList
                ? [...repeatStepList, ...stepsList]
                : stepsList
              : repeatStepList,
            pageInfo,
            document.chapterByStage,
            thisStage
          )}{" "}
        </Fragment>
      );
      // }
    };
    const stageChapters = () => {
      let i = 0;
      let chapterBasedOnStage = [];
      let stageList = Object.keys(
        stagesJson[removeSpace(lowerCaseFirstLetter(stageType))]
      );
      let thisStage = findNextStage(specData, undefined, stageType);

      while (stopLoop.current === false && i < 50) {
        if (document.chapters[thisStage["stageWithoutNumber"]]) {
          chapterBasedOnStage.push(
            runChapter(
              document.chapters[thisStage["stageWithoutNumber"]],
              thisStage["stage"],
              thisStage["number"]
            )
          );
        }
        thisStage = findNextStage(specData, thisStage["stage"], stageType);
        if (
          thisStage["stageWithoutNumber"] === stageList[stageList.length - 1]
        ) {
          break;
        }
        i++;
      }
      return chapterBasedOnStage;
    };
    stopLoop.current = false;
    const chapterBasedOnJson = document.chapterByStage
      ? [false]
      : document.chapters.map(pageInfo => {
          return runChapter(pageInfo);
        });
    return (
      <>
        {document.chapterByStage
          ? stage
            ? stageChapters()
            : null
          : chapterBasedOnJson}{" "}
        {!editChapter && !finalChapter && !!backButton ? (
          <SubmitButton type="button" onClick={backButton}>
            Back
          </SubmitButton>
        ) : null}
      </>
    );
  }
);
