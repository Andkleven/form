import React, { Fragment, useRef, useEffect, useContext } from "react";
import {
  findValue,
  allRequiredSatisfied,
  createPath,
  removeSpace
} from "functions/general.js";
import Page from "components/form/components/Page";
import findNextStage from "components/form/stage/findNextStage.ts";
import Line from "components/design/Line";
import Title from "components/design/fonts/Title";
import stagesJson from "components/form/stage/stages.json";
import { ChapterContext } from "components/form/Form";
import SubmitButton from "components/button/SubmitButton";

// import objectPath from "object-path";

export default props => {
  const { editChapter } = useContext(ChapterContext);
  const stopLoop = useRef(false); // Flips to true for last chapter with input
  let finalChapter = 0;
  let count = 0;
  // let stage = stagesJson["all"][0];

  const getNewChapter = (
    repeatStepList,
    pageInfo,
    byStage = false,
    thisStage = ""
  ) => {
    let chapter; // new chapter to add to document
    if (
      (pageInfo.chapterAlwaysInWrite || props.chapterAlwaysInWrite) &&
      !finalChapter
    ) {
      finalChapter = count + 1;
    }
    if (stopLoop.current) {
      chapter = null;
    } else {
      let allRequiredFieldSatisfied = props.data
        ? byStage
          ? thisStage === props.stage
          : !allRequiredSatisfied(
              pageInfo,
              props.data,
              repeatStepList,
              props.specData
            )
        : false;
      // if now data in lookUpBy this is last chapter
      if (allRequiredFieldSatisfied) {
        finalChapter = count + 1;
        if (props.readOnlySheet) {
          stopLoop.current = true;
        }
      }
      // Map through pages in this pages
      if (allRequiredFieldSatisfied && props.readOnlySheet) {
        chapter = null;
      } else {
        chapter = pageInfo.pages.map((info, index) => {
          let showEditButton = !props.notEditButton && !index ? true : false;
          let showSubmitButton =
            index === pageInfo.pages.length - 1 ? true : false;
          return (
            <Page
              key={`${index}-${count}-page`}
              {...info}
              {...props}
              // data={getData(info, repeatStepList, props.data)}
              path={createPath(info.queryPath, repeatStepList)}
              thisChapter={count + 1}
              stopLoop={stopLoop.current}
              showEditButton={showEditButton}
              indexId={`${count + 1}-${index}`}
              index={index}
              finalChapter={finalChapter}
              submitData={props.submitData}
              showSubmitButton={showSubmitButton}
              repeatStepList={repeatStepList}
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
      <Fragment key={`${count}-canvas-chapterFragment`}>{chapter}</Fragment>
    ) : null;
  };
  const runChapter = (pageInfo, thisStage = "", step = null) => {
    if (pageInfo && pageInfo.specChapter) {
      let numberOfChapters = findValue(
        props.specData,
        pageInfo.specChapter,
        step === null ? props.repeatStepList : [step]
      );
      if (numberOfChapters && numberOfChapters.length) {
        let newChapterArray = [];
        for (let index = 0; index < numberOfChapters.length; index++) {
          let newChapter = getNewChapter(
            step !== null
              ? [step, index]
              : props.repeatStepList
              ? [...props.repeatStepList, index]
              : [index],
            pageInfo
          );
          newChapterArray.push(
            newChapter ? (
              <Fragment key={`${count}-${index}-newChapterFragment`}>
                {newChapter}
              </Fragment>
            ) : null
          );
        }
        if (newChapterArray[newChapterArray.length - 1] === null) {
          props.nextStage.current = false;
        }
        return pageInfo.chapterTitle ? (
          <Fragment key={`${count}-${count + 1}-pageInfo-chapterTitle`}>
            <Title big>{pageInfo.chapterTitle}</Title>
            <Line />
            {newChapterArray}
          </Fragment>
        ) : (
          newChapterArray
        );
      }
      return null;
    } else {
      return (
        <Fragment key={`${count}-stageTitleSomething`}>
          {" "}
          {getNewChapter(
            step !== null
              ? props.repeatStepList
                ? [...props.repeatStepList, step]
                : [step]
              : props.repeatStepList,
            pageInfo,
            props.document.chapterByStage,
            thisStage
          )}{" "}
        </Fragment>
      );
    }
  };
  const stageChapters = () => {
    let i = 0;
    let chapterBasedOnStage = [];
    let thisStage = Object.keys(
      stagesJson[removeSpace(props.stageType.toLowerCase())]
    )[0];
    let stageSplit = thisStage.split("Step");

    while (stopLoop.current === false && i < 20) {
      chapterBasedOnStage.push(
        runChapter(
          props.document.chapters[
            stageSplit[1] ? stageSplit[0] + "Step" : thisStage
          ],
          thisStage,
          Number(stageSplit[1]) - 1
        )
      );
      thisStage = findNextStage(props.specData, thisStage, props.stageType);
      stageSplit = thisStage.split("Step");
      if (
        !props.document.chapters[
          stageSplit[1] ? stageSplit[0] + "Step" : thisStage
        ]
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
      stopLoop.current = false;
    };
  });

  return (
    <>
      {props.document.chapterByStage
        ? props.stage
          ? stageChapters()
          : null
        : chapterBasedOnJson}{" "}
      {!editChapter && !finalChapter && !!props.backButton ? (
        <SubmitButton type="button" onClick={props.backButton}>
          Back
        </SubmitButton>
      ) : null}
    </>
  );
};
