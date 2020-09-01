import React, { useContext, Fragment } from "react";
import FieldGroup from "components/form/components/fields/FieldGroup";
import objectPath from "object-path";
import { DocumentDataContext, ChapterContext } from "components/form/Form";
import {
  getRepeatNumber,
  getRepeatStepList,
  isLastCharacterNumber,
  variableString,
  writeChapter
} from "functions/general";
import Subtitle from "components/design/fonts/Subtitle";
import Line from "components/design/Line";
import DepthButton from "components/button/DepthButton";

export default ({ addOrRemove, ...props }) => {
  const { documentData } = useContext(DocumentDataContext);
  const {
    finalChapter,
    editChapter
  } = useContext(ChapterContext);
  const DeleteButton = props => (
    <DepthButton
      iconProps={{ icon: ["fas", "trash-alt"], className: "text-danger" }}
      // key={`${props.index}-DepthButton`}
      onClick={() => props.deleteHandler(props.index)}
      className="w-100 mt-1 mb-3"
    // style={{ position: "relative", bottom: ".9em" }}
    >
      Remove
    </DepthButton>
  );

  if (props.repeat) {
    if (
      Array.isArray(
        objectPath.get(
          Object.keys(documentData.current).length === 0
            ? props.backendData
            : documentData.current,
          props.path
        )
      )
    ) {
      return objectPath
        .get(
          Object.keys(documentData.current).length === 0
            ? props.backendData
            : documentData.current,
          props.path
        )
        .map((v, index) => {
          return (
            <Fragment key={`${index}-repeat-fragment`}>
              {props.pageTitle && props.indexVariablePageTitle !== undefined ? (
                <>
                  <Subtitle className={!writeChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter) && "mt-3"}>
                    {variableString(index + 1, props.pageTitle)}
                  </Subtitle>
                  <Line></Line>
                </>
              ) : null}
              <FieldGroup
                {...props}
                repeatStepList={getRepeatStepList(props.repeatStepList, index)}
                repeatStep={index}
                // key={`${props.indexId}-${index}-FieldGroup`}
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
              {!!props.delete && !!writeChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter) && (
                props.repeatStartWithOneGroup ? (
                  !!index && (
                    <DeleteButton
                      index={index}
                      deleteHandler={props.deleteHandler}
                    />
                  )
                ) : (
                    <DeleteButton
                      index={index}
                      deleteHandler={props.deleteHandler}
                    />
                  )
              )}
            </Fragment>
          );
        });
    } else if (!props.queryPath) {
      let arraySetFieldGroupData = [];
      let repeatNumber = getRepeatNumber(
        props.specData,
        props.repeatGroupWithQuery,
        props.repeatStepList,
        props.editRepeatStepListRepeat
      );
      for (let index = 0; index < repeatNumber; index++) {
        arraySetFieldGroupData.push(
          <FieldGroup
            key={`${index}-FieldGroup-${props.indexId}`}
            {...props}
            repeatStepList={getRepeatStepList(props.repeatStepList, index)}
            repeatStep={index}
            path={props.path ? `${props.path}.${index}.data` : null}
            indexId={`${props.indexId}-${index}`}
          />
        );
      }
      if (arraySetFieldGroupData[0]) {
        return arraySetFieldGroupData;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return (
      <FieldGroup
        {...props}
        repeatStepList={getRepeatStepList(props.repeatStepList, 0)}
        file={
          objectPath.get(props.backendData, props.path + ".0.data") &&
          objectPath.get(props.backendData, props.path + ".0.data").file
        }
        path={
          props.path
            ? isLastCharacterNumber(props.path)
              ? props.path
              : `${props.path}.0`
            : null
        }
        repeatStep={0}
        indexId={`${props.indexId}-0`}
      />
    );
  }
};
