import React, { Fragment, useRef, useContext } from "react";
import {
  createPath,
  removeSpace,
  lowerCaseFirstLetter
} from "functions/general.js";
import Page from "components/form/components/Page";
import findNextStage from "components/form/stage/findNextStage.ts";
import objectPath from "object-path";
import stagesJson from "components/form/stage/stages.json";
import { ChapterContext, DocumentDataContext } from "components/form/Form";
import SubmitButton from "components/button/SubmitButton";
import AutoScroll from "components/AutoScroll";

// import objectPath from "object-path";

export default ({ stagePath, ...props }) => {
  const { editChapter } = useContext(ChapterContext);
  const {
    documentData
  } = useContext(DocumentDataContext);

  const stopLoop = useRef(false); // Flips to true for last chapter with input
  let finalChapter = 0;
  let count = 0;
  const getNewChapter = (
    repeatStepList,
    pageInfo,
    byStage = false,
    thisStage = "",
  ) => {
    let chapter; // new chapter to add to document
    let allRequiredFieldSatisfied = false;
    if (
      (pageInfo.chapterAlwaysInWrite || props.chapterAlwaysInWrite) &&
      !finalChapter
    ) {
      finalChapter = count + 1;
    }
    if (stopLoop.current) {
      chapter = null;
    } else {
      allRequiredFieldSatisfied = documentData.current ?
        byStage ? thisStage === props.stage
          : !objectPath.get(documentData.current, createPath(pageInfo.stageQueryPath, repeatStepList), false)
        : false;
      // if now data in lookUpBy this is last chapter
      if (allRequiredFieldSatisfied) {
        stagePath.current = createPath(pageInfo.stageQueryPath, repeatStepList)
        finalChapter = count + 1;
        if (props.readOnlySheet) {
          stopLoop.current = true;
        }
      }

      if (allRequiredFieldSatisfied && props.readOnlySheet) {
        chapter = null;
      } else {
        chapter = pageInfo.pages.map((info, index) => {
          let showEditButton = !props.notEditButton && !index ? true : false;
          let showSubmitButton = index === pageInfo.pages.length - 1
            ? true
            : false;
          return (
            <Page
              key={`${index}-${count}-${repeatStepList}-page`}
              {...info}
              {...props}
              path={createPath(info.queryPath, repeatStepList)}
              thisChapter={count + 1}
              stopLoop={stopLoop.current}
              showEditButton={showEditButton}
              indexId={`${count + 1}- ${index} `}
              index={index}
              noSaveButton={props.document.noSaveButton}
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
    return chapter
      ? (
        <Fragment key={`${count} -canvas - chapterFragment`}>
          {allRequiredFieldSatisfied && !editChapter && <AutoScroll />}
          {chapter}
        </Fragment>
      )
      : null;
  };
  const runChapter = (pageInfo, thisStage = "", stepsList = undefined) => {
    return (
      <Fragment key={`${count} -stageTitleSomething`}>
        {" "}
        {getNewChapter(
          stepsList !== undefined
            ? props.repeatStepList
              ? [...props.repeatStepList, ...stepsList]
              : stepsList
            : props.repeatStepList,
          pageInfo,
          props.document.chapterByStage,
          thisStage,
        )}
        {" "}
      </Fragment>
    );
    // }
  };
  const stageChapters = () => {
    let i = 0;
    let chapterBasedOnStage = [];
    let stageList = Object.keys(
      stagesJson[removeSpace(lowerCaseFirstLetter(props.stageType))],
    );
    let thisStage = findNextStage(
      props.specData,
      undefined,
      props.stageType,
    );

    while (stopLoop.current === false && i < 50) {
      if (props.document.chapters[thisStage["stageWithoutNumber"]]) {
        chapterBasedOnStage.push(
          runChapter(
            props.document.chapters[thisStage["stageWithoutNumber"]],
            thisStage["stage"],
            thisStage["number"],
          ),
        );
      }
      thisStage = findNextStage(
        props.specData,
        thisStage["stage"],
        props.stageType,
      );

      if (thisStage["stageWithoutNumber"] === stageList[stageList.length - 1]) {
        break;
      }
      i++;
    }
    return chapterBasedOnStage;
  };
  stopLoop.current = false;
  const chapterBasedOnJson = props.document.chapterByStage
    ? [false]
    : props.document.chapters.map((pageInfo) => {
      return runChapter(pageInfo);
    });
  return (
    <>
      {props.document.chapterByStage
        ? props.stage ? stageChapters() : null
        : chapterBasedOnJson}
      {" "}
      {!editChapter && !finalChapter && !!props.backButton
        ? (
          <SubmitButton type="button" onClick={props.backButton}>
            Back
          </SubmitButton>
        )
        : null}
    </>
  );
};
