import React, { useState } from "react";
import Input from "components/Input";

const stages = [
  { value: "steel_preparation_1" },
  { value: "steel_preparation_2" },
  { value: "priming" },
  { value: "measurement" },
  { value: "coating" },
  { value: "vulcanization" },
  { value: "touch_up" }
];

const itemTypes = [{ value: "Coated Item" }, { value: "Mould" }];

export default props => {
  const [term, setTerm] = useState("");
  return (
    <>
      <h6 className="pb-1">Filter</h6>
      <div className="mb-3">
        <Input
          placeholder="Stage"
          type="select"
          options={stages}
          select="select"
          tight
        />
        <Input
          placeholder="Type of item"
          type="select"
          options={itemTypes}
          select="select"
          tight
        />
        <Input
          placeholder="Search..."
          tight
          value={term}
          onChange={e => setTerm(e.target.value)}
          unit={
            <i
              className="fas fa-search"
              style={{ position: "relative", top: "0.09em" }}
            />
          }
        />
      </div>
      {props.children}
    </>
  );
};
