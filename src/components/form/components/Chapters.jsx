import React, { Fragment, useRef, useContext } from "react";
import {
  createPath,
  getProperties,
  removePathFunc,
  getProductionLine
} from "../../functions/general.js";
import Page from "./Page";
import findNextStage from "../stage/findNextStage.ts";
import objectPath from "object-path";
import { ChapterContext, DocumentDataContext } from "../Form";
import SubmitButton from "../../button/SubmitButton";
import AutoScroll from "../../div/AutoScroll";
import { ConfigContext } from "../../Config.tsx";

export default React.memo(
  ({
    stagePath,
    backendData,
    optionsData,
    submitData,
    edit,
    removePath,
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
    allData,
    itemIdsRef,
    itemId,
    specRemovePath,
    stagesChapter,
    exitOnSave
  }) => {
    function getShowPage(page) {
      return (
        (page.showPage === undefined ||
          (page.showPage && getProperties(page.showPage, jsonVariables))) &&
        (page.showIfSpec === undefined ||
          (page.showIfSpec &&
            objectPath.get(
              specData,
              getProperties(page.showIfSpec, jsonVariables),
              false
            )))
      );
    }
    const { stages } = useContext(ConfigContext);
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
          allRequiredFieldSatisfied = Object.keys(documentData.current).length
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
            stagesChapter.current[thisStage] = true;
            let showEditButton;
            let showSubmitButton;
            pageInfo.pages.forEach((page, index) => {
              if (getShowPage(page)) {
                if (!notEditButton && showEditButton === undefined) {
                  showEditButton = index;
                }
                showSubmitButton = index;
              }
            });
            chapter = pageInfo.pages.map((page, index) => {
              if (getShowPage(page)) {
                return (
                  <Page
                    key={`${index}-${count}-${repeatStepListLocal}-page`}
                    {...page}
                    allData={allData}
                    backendData={backendData}
                    optionsData={optionsData}
                    submitData={submitData}
                    document={document}
                    edit={edit}
                    specData={specData}
                    readOnlySheet={readOnlySheet}
                    jsonVariables={jsonVariables}
                    chapterAlwaysInWrite={chapterAlwaysInWrite}
                    stage={stage}
                    repeatStepList={repeatStepListLocal}
                    path={createPath(
                      removePathFunc(removePath, page.queryPath),
                      repeatStepListLocal
                    )}
                    thisChapter={count + 1}
                    stopLoop={stopLoop.current}
                    showEditButton={showEditButton === index}
                    indexId={`${count + 1}- ${index} `}
                    index={index}
                    noSaveButton={document.noSaveButton}
                    finalChapterRef={allRequiredFieldSatisfied ? count + 1 : 0}
                    showSubmitButton={showSubmitButton === index}
                    itemIdsRef={itemIdsRef}
                    itemId={itemId}
                    specRemovePath={specRemovePath}
                    exitOnSave={exitOnSave}
                  />
                );
              }
              return null;
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
      let productionLine = getProductionLine(stageType);
      let stageList = Object.keys(stages[productionLine]);
      let thisStage = findNextStage(
        specData,
        undefined,
        stageType,
        document.chapters
      );

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
        thisStage = findNextStage(
          specData,
          thisStage["stage"],
          stageType,
          document.chapters
        );
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
