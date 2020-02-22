import React, { useEffect, useContext } from "react";
import Math from "./Math";
import { ValuesContext } from "../page/canvas";
import TabelFields from "./TableFields";

import "../styles/styles.css";

const Table = props => {
  const valuesContext = useContext(ValuesContext);

  useEffect(() => {
    if (
      valuesContext.values[props.count][props.name] !== undefined &&
      valuesContext.values[props.count][props.name][props.listIndex] !==
        undefined
    ) {
      valuesContext.setValues(prevState => ({
        ...prevState,
        [props.count]: {
          ...prevState[props.count],
          [props.name]: {
            ...prevState[props.count][props.name],
            [props.listIndex]: {
              ...prevState[props.count][props.name][props.listIndex],
              ...props.state
            }
          }
        }
      }));
    }
  }, [
    props.state,
    props.valuesDefined,
    props.count,
    props.name,
    props.listIndex
  ]);

  const tabel = props.json.map((value, index) => {
    return (
      <TabelFields
        {...props}
        {...value}
        key={`${props.index}-${index}`}
        index={index}
      />
    );
  });
  return <>{tabel}</>;
};

export default Table;
