import React, { Fragment } from "react";
import {
  getData,
  findValue,
  allRequiredSatisfied,
  createPath
} from "./Functions";
import Page from "./Page";
import Title from "./Title";
// import objectPath from "object-path";

export default props => {
  let stopLoop = false; // True when we are at the first chaper now one have wirte on
  let temporaryLastChapter = 0;
  let count = 0;
  return props.document.chapters.map(pageInfo => {
    const newChapter = arrayIndex => {
      let chapter; // new chapter to add to document

      if (
        (pageInfo.chapterAlwaysInWrite || props.chapterAlwaysInWrite) &&
        !temporaryLastChapter
      ) {
        console.log(count + 1);
        temporaryLastChapter = count + 1;
      }
      if (stopLoop) {
        chapter = null;
      } else {
        let allRequiredFieldSatisfied = props.data
          ? allRequiredSatisfied(pageInfo, props.data, arrayIndex)
          : false;
        // if now data in lookUpBy this is last chapter
        if (!allRequiredFieldSatisfied) {
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
              key={`${index}-${count}-cancas`}
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
              // repeatGroup={repeatGroup}
              submitData={props.submitData}
              mutation={props.mutation}
              showSaveButton={showSaveButton}
              arrayIndex={arrayIndex}
            />
          );
        });
        // if now data in lookUpBy stop loop
        if (!allRequiredFieldSatisfied) {
          stopLoop = true;
        }
      }
      count += 1;
      return (
        <Fragment key={`${count}-cancas`}>
          {chapter ? <Title key={count} title={pageInfo.chapterTitle} /> : null}
          {chapter}
        </Fragment>
      );
    };

    if (pageInfo.chapterBySpeckData) {
      let numberOfChapters = findValue(
        props.speckData,
        pageInfo.chapterBySpeckData,
        props.arrayIndex
      );
      if (numberOfChapters && numberOfChapters.length) {
        let newChapterArray = [];
        for (let i = 0; i < numberOfChapters.length; i++) {
          newChapterArray.push(
            <Fragment key={count}>
              {" "}
              {newChapter([...props.arrayIndex, i])}{" "}
            </Fragment>
          );
        }
        return newChapterArray;
      }
      return null;
    } else {
      return <Fragment key={count}> {newChapter(props.arrayIndex)} </Fragment>;
    }
  });
};

// const createDocumentFromStage = (props, view) => {
//   let stopLoop = false; // True when we are at the first chaper now one have wirte on
//   const subchapter = (
//     getDataFromGroupWithLookUpBy,
//     i,
//     chaptersInfo,
//     chapter
//   ) => {
//     let thisChapter;
//     chapterCount += 1;
//     if (
//       notDataInField(getDataFromGroupWithLookUpBy[i], chaptersInfo.lookUpBy)
//     ) {
//       chapterContext.setLastChapter(chapterCount);
//     }
//     if (stopLoop && chapter.length === 0) {
//       chapter = null;
//     } else if (!stopLoop) {
//       thisChapter = chapterPages(
//         props,
//         view,
//         chapterCount,
//         stopLoop,
//         chaptersInfo
//       );
//     }
//     if (
//       notDataInField(getDataFromGroupWithLookUpBy[i], chaptersInfo.lookUpBy)
//     ) {
//       stopLoop = true;
//     }
//     chapter.push(
//       <Fragment key={`${chapterCount}-cancas`}>
//         {thisChapter ? (
//           <Title key={chapterCount} title={chaptersInfo.chapterTitle} />
//         ) : null}
//         {thisChapter}
//       </Fragment>
//     );
//   };

//   let chapterCount = 0;
//   const document = Object.values(
//     props.chaptersJson[
//       props.specificStage ? ["chapters"][props.specificStage] : "chapters"
//     ]
//   ).map(chaptersInfo => {
//     let chapter;
//     if (stopLoop) {
//       chapter = null;
//     } else {
//       let getDataFromGroupWithLookUpBy = getData(
//         chaptersInfo,
//         props.arrayIndex,
//         props.data
//       );
//       chapter = [];
//       if (chaptersInfo.numberFromSpackField) {
//         let speckChapterData = getDataFromQuery(
//           props.speckData,
//           chaptersInfo.spackQueryPath,
//           chaptersInfo.spackFieldPath
//         );
//         if (emptyField(speckChapterData)) {
//           return null;
//         }
//         for (let i = 0; i < Number(speckChapterData); i++) {
//           subchapter(getDataFromGroupWithLookUpBy, i, chaptersInfo, chapter);
//         }
//       } else if (emptyField(chaptersInfo.spackQueryPath)) {
//         subchapter(getDataFromGroupWithLookUpBy, 0, chaptersInfo, chapter);
//       } else if (emptyField(chaptersInfo.spackFieldPath)) {
//         if (
//           !emptyField(
//             objectPath.get(props.speckData, chaptersInfo.spackQueryPath, null)
//           )
//         ) {
//           subchapter(getDataFromGroupWithLookUpBy, 0, chaptersInfo, chapter);
//         } else {
//           return null;
//         }
//       } else if (
//         !emptyField(
//           getDataFromQuery(
//             props.speckData,
//             chaptersInfo.spackQueryPath,
//             chaptersInfo.spackFieldPath
//           )
//         )
//       ) {
//         subchapter(getDataFromGroupWithLookUpBy, 0, chaptersInfo, chapter);
//       } else {
//         return null;
//       }
//     }
//     return chapter;
//   });
//   return document;
// };
