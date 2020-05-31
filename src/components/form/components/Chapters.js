import React, { Fragment, useContext, useRef, useEffect } from "react";
import { findValue, allRequiredSatisfied, createPath, removeSpace } from "functions/general";
import Page from "components/form/components/Page";
import findNextStage from "components/form/stage/findNextStage.ts";
import Title from "components/design/fonts/Title";
import { ChapterContext } from "components/form/Form";
import stagesJson from "components/form/stage/stages.json";

// import objectPath from "object-path";

export default props => {
  const {setLastSubmitButton} = useContext(ChapterContext);

  const stopLoop = useRef(false) // Flips to true for last chapter with input
  let temporaryLastChapter = 0;
  let count = 0;
  let stage = stagesJson["all"][0];

  const getNewChapter = (arrayIndex, pageInfo, thisStage="") => {
    let chapter; // new chapter to add to document
    if (
      (pageInfo.chapterAlwaysInWrite || props.chapterAlwaysInWrite) &&
      !temporaryLastChapter
    ) {
      temporaryLastChapter = count + 1;
    }
    if (stopLoop.current) {
      chapter = null;
    } else {
      let allRequiredFieldSatisfied = props.data
      ? props.document.chapterByStage
        ? thisStage === stage
        : !allRequiredSatisfied(pageInfo, props.data, arrayIndex)
      : false;
      // if now data in lookUpBy this is last chapter
      if (allRequiredFieldSatisfied) {
        temporaryLastChapter = count + 1;
      }
      // Map through pages in this pages
      chapter = pageInfo.pages.map((info, index) => {
        let showEditButton = !props.notEditButton && !index ? true : false;
        let showSaveButton =
          index === pageInfo.pages.length - 1 && !props.notSubmitButton
            ? true
            : false;
        return (
          <Page
            key={`${index}-${count}-canvas`}
            {...info}
            {...props}
            submitHandler={props.submitHandler}
            // data={getData(info, arrayIndex, props.data)}
            path={createPath(info.queryPath, arrayIndex)}
            thisChapter={count + 1}
            stopLoop={stopLoop.current}
            showEditButton={showEditButton}
            indexId={`${count + 1}-${index}`}
            index={index}
            lastChapter={temporaryLastChapter}
            submitData={props.submitData}
            showSaveButton={showSaveButton}
            arrayIndex={arrayIndex}
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
        props.specData,
        pageInfo.specChapter,
        step === null ? props.arrayIndex : [step]
      );
      if (numberOfChapters && numberOfChapters.length) {
        let newChapterArray = [];
        for (let index = 0; index < numberOfChapters.length; index++) {
          let newChapter = getNewChapter(
            step !== null
              ? [step, index]
              : props.arrayIndex
              ? [...props.arrayIndex, index]
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
          props.setNextStage(false);
        }
        return newChapterArray;
      }
      return null;
    } else {
      return (
        <Fragment key={count}>
          {" "}
          {getNewChapter(props.arrayIndex, pageInfo, thisStage)}{" "}
        </Fragment>
      );
    }
  };
  const stageChapters = () => {
    let i = 0;
    let stageSplit = [];
    let chapterBasedOnStage = [];
    let thisStage = props.stage
    if (props.stage === "" && props.geometry){
      thisStage = Object.keys(stagesJson[removeSpace(props.geometry.toLowerCase())])[0]
    } 
    while (stopLoop.current === false && i < 20) {
      chapterBasedOnStage.push(
        runChapter(
          props.document.chapters[
            stageSplit[1] ? stageSplit[0] + "Step" : stage
          ],
          thisStage,
          stageSplit[1] - 1
        )
      );
      stage = findNextStage(props.specData, stage, props.geometry);
      stageSplit = stage.split("Step");
      if (
        !props.document.chapters[stageSplit[1] ? stageSplit[0] + "Step" : stage]
      ) {
        break;
      }
      i++;
    }
    return chapterBasedOnStage;
  };
  const chapterBasedOnJson = props.document.chapterByStage
    ? [false]
    : props.document.chapters.map(pageInfo => {
        return runChapter(pageInfo);
      });
  
  useEffect(() => {
    return () => {
      if (stopLoop.current === false) {
        setLastSubmitButton(true);
      }
    }
  }, [setLastSubmitButton])
  useEffect(() => {
    return () => {
      stopLoop.current = false
    }
  })

  return props.document.chapterByStage ? stageChapters() : chapterBasedOnJson;
};
