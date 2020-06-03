import React, { useContext } from "react";
import objectPath from "object-path";
import FieldProperties from "components/form/components/fields/FieldProperties";
import Page from "components/form/components/Page";
import { DocumentDateContext } from "components/form/Form";
import Line from "components/design/Line";
import { findValue } from "functions/general";

export default props => {
  const { documentDate, documentDateDispatch } = useContext(
    DocumentDateContext
  );
  return props.fields.map((field, index) => {
    if (
      field.showFieldSpecPath &&
      [null, undefined, "", false].includes(
        findValue(
          props.specData,
          field.showFieldSpecPath,
          props.repeatStepList,
          field.editRepeatStepValueList
        )
      )
    ) {
      return null;
    } else if (field.line) {
      return <Line key={`${props.indexId}-${index}`} />;
    } else if (field.page) {
      if (
        objectPath.get(
          documentDate,
          `${props.path}.${field.queryPath}`,
          null
        ) === null
      ) {
        documentDateDispatch({
          type: "add",
          newState: [],
          path: `${props.path}.${field.queryPath}`
        });
      }
      return (
        <Page
          {...field}
          key={index}
          temporaryLastChapter={props.temporaryLastChapter}
          optionsData={props.optionsData}
          backendData={props.backendData}
          repeatStepList={props.repeatStepList}
          submitData={props.submitData}
          thisChapter={props.thisChapter}
          stopLoop={props.stopLoop}
          readOnlyFields={props.readOnlyFields}
          showEditButton={false}
          // data={props.data}
          path={`${props.path}.${field.queryPath}`}
        />
      );
    } else {
      return (
        <FieldProperties key={index} {...field} {...props} index={index} />
      );
    }
  });
};
