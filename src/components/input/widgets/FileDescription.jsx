import React, { useContext } from "react";
import Input from "components/input/Input";
import ReadField from "components/form/components/fields/ReadField";
import TinyButton from "components/button/TinyButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChapterContext } from "components/form/Form";
import { writeChapter } from "functions/general";

export default ({ ...props }) => {
  const {
    finalChapter,
    editChapter
  } = useContext(ChapterContext);
  const FileName = () => (
    <div
      className={(writeChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter.current) && "mb-2") || ""}
      style={{
        wordBreak: "break-word"
      }}
    >
      <FontAwesomeIcon
        icon={["fad", "file-image"]}
        className={`text-primary text-center shadow-sm mr-2`}
        swapOpacity
      />
      {props.file.file.name}
    </div>
  );

  if (props.description && writeChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter.current)) {
    return (
      <div className="mt-2">
        <div className={(writeChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter.current) && "pt-2") || ""}>
          <div className="d-flex justify-content-between">
            <FileName />
            {writeChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter.current) && (
              <TinyButton
                onClick={() => props.deleteHandler(props.index)}
                icon="trash-alt"
                color="danger"
                tooltip={`Delete "${props.file.file.name}"`}
                noPadding
              >
                Delete
              </TinyButton>
            )}
          </div>
        </div>
        <Input
          noComment
          placeholder={`Description or comment...`}
          onChangeInput={e => props.onChange(e.target, props.index)}
        />
      </div>
    );
  } else {
    return (
      <ReadField
        {...props}
        noLine
        key={`${props.indexId}-readField-fileDescription`}
        readOnly={true}
        label={
          <div className="d-flex justify-content-between">
            <div>
              <FileName />
            </div>
          </div>
        }
        value={props.file.fileDescription ? props.file.fileDescription : ""}
      />
    );
  }
};
