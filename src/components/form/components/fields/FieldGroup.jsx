import React from "react";
import FieldProperties from "components/form/components/fields/FieldProperties";
import Page from "components/form/components/Page";
import { findValue } from "functions/general";

export default props => {
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
    } else if (field.page) {
      return (
        <Page
          {...field}
          key={`${index}-${field.queryPath}-page`}
          edit={props.edit}
          finalChapter={props.finalChapter}
          optionsData={props.optionsData}
          backendData={props.backendData}
          repeatStepList={props.repeatStepList}
          submitData={props.submitData}
          thisChapter={props.thisChapter}
          stopLoop={props.stopLoop}
          readOnlyFields={props.readOnlyFields}
          showEditButton={false}
          path={`${props.path}.${field.queryPath}`}
        // noLine
        // className={`${props.indent && "ml-3 ml-sm-5"}`}
        />
      );
    } else {
      return (
        <FieldProperties
          key={`${index}-${field.fieldName}-field-properties`}
          {...field}
          {...props}
          index={index}
        />
      );
    }
  });
};
