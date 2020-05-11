import React, { Fragment, useEffect } from "react";
import {
  getData,
  findValue,
  allRequiredSatisfied,
  createPath
} from "functions/general";
import Page from "components/form/components/Page";
import findNextStage from "components/form/stage/findNextStage";
import Title from "components/design/fonts/Title";

// import objectPath from "object-path";

export default props => {
  let stopLoop = false; // Flips to true for last chapter with input
  let temporaryLastChapter = 0;
  let count = 0;
  let stage = "steelPreparation1";

  const getNewChapter = (arrayIndex, pageInfo) => {
    let chapter; // new chapter to add to document

    if (
      (pageInfo.chapterAlwaysInWrite || props.chapterAlwaysInWrite) &&
      !temporaryLastChapter
    ) {
      temporaryLastChapter = count + 1;
    }
    if (stopLoop) {
      chapter = null;
    } else {
      let allRequiredFieldSatisfied = props.data
        ? props.document.chapterByStage
          ? props.stage === stage
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
            data={getData(info, arrayIndex, props.data)}
            path={createPath(info.queryPath, arrayIndex)}
            thisChapter={count + 1}
            stopLoop={stopLoop}
            showEditButton={showEditButton}
            indexId={`${count + 1}-${index}`}
            index={index}
            lastChapter={temporaryLastChapter}
            submitData={props.submitData}
            mutation={props.mutation}
            showSaveButton={showSaveButton}
            arrayIndex={arrayIndex}
          />
        );
      });
      // if now data in lookUpBy stop loop
      if (allRequiredFieldSatisfied) {
        stopLoop = true;
      }
    }
    count += 1;
    return chapter ? (
      <Fragment key={`${count}-canvas`}>{chapter}</Fragment>
    ) : null;
  };
  const runChapter = (pageInfo, step = null) => {
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
            pageInfo
          );
          newChapterArray.push(
            <Fragment key={count}>
              {pageInfo.chapterTitle && !index ? (
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
          {getNewChapter(props.arrayIndex, pageInfo)}{" "}
        </Fragment>
      );
    }
  };
  const stageChapters = () => {
    let i = 0;
    let stageSplit = [];
    let chapterBasedOnStage = [];
    while (stopLoop === false && i < 20) {
      chapterBasedOnStage.push(
        runChapter(
          props.document.chapters[
            stageSplit[1] ? stageSplit[0] + "Step" : stage
          ],
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
    if (["Nei"].includes(stage)) {
      props.setLastSubmitButton(true);
    }
    return chapterBasedOnStage;
  };
  const chapterBasedOnJson = props.document.chapterByStage
    ? [false]
    : props.document.chapters.map(pageInfo => {
        return runChapter(pageInfo);
      });
  useEffect(() => {
    if (chapterBasedOnJson[chapterBasedOnJson.length - 1]) {
      props.setLastSubmitButton(true);
    }
  }, [chapterBasedOnJson]);

  return props.document.chapterByStage ? stageChapters() : chapterBasedOnJson;
};
