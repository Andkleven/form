import React, { Fragment, useRef, useEffect, useContext, useMemo } from "react";
import { findValue, allRequiredSatisfied, createPath, removeSpace } from "functions/general";
import Page from "components/form/components/Page";
import findNextStage from "components/form/stage/findNextStage.ts";
import Title from "components/design/fonts/Title";
import stagesJson from "components/form/stage/stages.json";
import { ChapterContext } from "components/form/Form";
import SubmitButton from "components/button/SubmitButton";

// import objectPath from "object-path";

export default ({
                componentsId,
                document,
                reRender,
                data,
                getQueryBy,
                descriptionId,
                itemId,
                sendItemId,
                backButton,
                backendData,
                optionsData,
                submitData,
                setNextStage,
                chapterAlwaysInWrite,
                notEditButton,
                notSubmitButton,
                specData,
                repeatStepList,
                geometry
              }) => {
  const { editChapter } = useContext(ChapterContext);

  const stopLoop = useRef(false) // Flips to true for last chapter with input
  const temporaryLastChapter = useRef(0) 
  const Chapter = useMemo(
    () => {
  let count = 0;
  let stage = stagesJson["all"][0];

  const getNewChapter = (repeatStepList, pageInfo, thisStage="") => {
    let chapter; // new chapter to add to document
    if (
      (pageInfo.chapterAlwaysInWrite || chapterAlwaysInWrite) &&
      !temporaryLastChapter.current
    ) {
      temporaryLastChapter.current = count + 1;
    }
    if (stopLoop.current) {
      chapter = null;
    } else {
      let allRequiredFieldSatisfied = data
      ? document.chapterByStage
        ? thisStage === stage
        : !allRequiredSatisfied(pageInfo, data, repeatStepList)
      : false;
      // if now data in lookUpBy this is last chapter
      if (allRequiredFieldSatisfied) {
        temporaryLastChapter.current = count + 1;
      }
      // Map through pages in this pages
      chapter = pageInfo.pages.map((info, index) => {
        let showEditButton = !notEditButton && !index ? true : false;
        let showSaveButton =
          index === pageInfo.pages.length - 1 && !notSubmitButton
            ? true
            : false;
        return (
          <Page
            key={`${index}-${count}-canvas`}
            {...info}
            componentsId={componentsId}
            document={document}
            reRender={reRender}
            data={data}
            getQueryBy={getQueryBy}
            descriptionId={descriptionId}
            itemId={itemId}
            sendItemId={sendItemId}
            backButton={backButton}
            backendData={backendData}
            optionsData={optionsData}
            submitData={submitData}
            setNextStage={setNextStage}
    
            // data={getData(info, repeatStepList, data)}
            path={createPath(info.queryPath, repeatStepList)}
            thisChapter={count + 1}
            stopLoop={stopLoop.current}
            showEditButton={showEditButton}
            indexId={`${count + 1}-${index}`}
            index={index}
            temporaryLastChapter={temporaryLastChapter.current}
            showSaveButton={showSaveButton}
            repeatStepList={repeatStepList}
          />
        );
      });
      // if now data in lookUpBy stop loop
      if (allRequiredFieldSatisfied) {
        stopLoop.current = true;
      }
    }
    count += 1;
    return chapter ? (
      <Fragment key={`${count}-canvas`}>{chapter}</Fragment>
    ) : null;
  };
  const runChapter = (pageInfo, thisStage="", step = null) => {
    if (pageInfo.specChapter) {
      let numberOfChapters = findValue(
        specData,
        pageInfo.specChapter,
        step === null ? repeatStepList : [step]
      );
      if (numberOfChapters && numberOfChapters.length) {
        let newChapterArray = [];
        for (let index = 0; index < numberOfChapters.length; index++) {
          let newChapter = getNewChapter(
            step !== null
              ? [step, index]
              : repeatStepList
              ? [...repeatStepList, index]
              : [index],
            pageInfo,
            thisStage
          );
          newChapterArray.push(
            <Fragment key={count}>
              {pageInfo.chapterTitle ? (
                <Title title={pageInfo.chapterTitle} />
              ) : null}
              {newChapter}
            </Fragment>
          );
        }
        if (newChapterArray[newChapterArray.length - 1] === null) {
          setNextStage(false);
        }
        return newChapterArray;
      }
      return null;
    } else {
      return (
        <Fragment key={count}>
          {" "}
          {getNewChapter(repeatStepList, pageInfo, thisStage)}{" "}
        </Fragment>
      );
    }
  };
  const stageChapters = () => {
    let i = 0;
    let stageSplit = [];
    let chapterBasedOnStage = [];
    let thisStage = stage ? stage : stage
    if (stage === "" && geometry){
      thisStage = Object.keys(stagesJson[removeSpace(geometry.toLowerCase())])[0]
    } 
    while (stopLoop.current === false && i < 20) {
      chapterBasedOnStage.push(
        runChapter(
          document.chapters[
            stageSplit[1] ? stageSplit[0] + "Step" : stage
          ],
          thisStage,
          stageSplit[1] - 1
        )
      );
      stage = findNextStage(specData, stage, geometry);
      stageSplit = stage.split("Step");
      if (
        !document.chapters[stageSplit[1] ? stageSplit[0] + "Step" : stage]
      ) {
        break;
      }
      i++;
    }
    return chapterBasedOnStage;
  };
  
  const chapterBasedOnJson = document.chapterByStage
    ? [false]
    : document.chapters.map(pageInfo => {
        return runChapter(pageInfo);
      });

      return (
        <>
        {document.chapterByStage ? stageChapters() : chapterBasedOnJson} {!editChapter && !temporaryLastChapter.current && !!backButton ? (
        <SubmitButton type="button" onClick={backButton}>
          Back
        </SubmitButton>
      ) : null}
      </>);
},[
  editChapter,
  componentsId,
  document,
  reRender,
  data,
  getQueryBy,
  descriptionId,
  itemId,
  sendItemId,
  backButton,
  backendData,
  optionsData,
  submitData,
  setNextStage,
  chapterAlwaysInWrite,
  geometry,
  notEditButton,
  notSubmitButton,
  repeatStepList,
  specData
  ])
  useEffect(() => {
    return () => {
      stopLoop.current = false
      temporaryLastChapter.current = 0
    }
  })

  return (<> {Chapter} </>)
};
