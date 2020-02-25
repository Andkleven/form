import React, { useState, useEffect } from "react";
import objectPath from "object-path";

export default props => {
  useEffect(() => {}, []);

  return (
    <>
      {objectPath.get(props.data, props.json.dataPath).map((value, index) => {
        return (
          <li key={index}>
            <div>
              <h2>{value}</h2>
            </div>
          </li>
        );
      })}
    </>
  );
};
