import React from "react";
import FieldProperties from "components/form/components/fields/FieldProperties";
import Page from "components/form/components/Page";
import { findValue, getProperties } from "functions/general";

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
    } else if (field.showField && !getProperties(field.showField, props.jsonVariables)) {
      return null
    } else if (field.page) {
      if (getProperties(field.page, props.jsonVariables)) {
        return (
          <Page
            {...field}
            key={`${index}-${field.queryPath}-page`}
            edit={props.edit}
            optionsData={props.optionsData}
            backendData={props.backendData}
            repeatStepList={props.repeatStepList}
            submitData={props.submitData}
            thisChapter={props.thisChapter}
            stopLoop={props.stopLoop}
            readOnlyFields={props.readOnlyFields}
            showEditButton={false}
            path={`${props.path}.${field.queryPath}`}
          />
        );
      } else {
        return null
      }
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
