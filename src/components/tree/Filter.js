import React, { useState } from "react";
import Input from "components/Input";
import Button from "react-bootstrap/Button";
import { search } from "./functions";
import ProjectTree from "./ProjectTree";
import Projects from "./Projects";
import stagesJson from "components/stages/Stages.json";
const cloneDeep = require("clone-deep");

const createStages = operatorStages => {
  let stages = cloneDeep(operatorStages.all);
  stages.unshift("leadEngineer");
  stages.push("qualityControl");
  return stages;
};

const stages = createStages(stagesJson);
const itemTypes = ["Coated Item", "Mould"];

export default props => {
  const [filters, setFilters] = useState(props.defaultFilters || {});
  const [searchTerm, setSearchTerm] = useState(props.defaultSearch || "");
  const results = search(props.data, filters, searchTerm);

  const clearAll = () => {
    setFilters({});
    setSearchTerm("");
  };

  return (
    <>
      <h6 className="pb-1">Filter</h6>
      <div className="mb-3">
        <form id="filterForm">
          <Input
            key="stageTermInput"
            placeholder="Stage"
            type="select"
            options={stages}
            select="select"
            tight
            value={filters.stage}
            onChange={e => {
              if (e) {
                if (e.value) {
                  setFilters({ ...filters, stage: e.value });
                } else {
                  let tempFilters = { ...filters };
                  delete tempFilters.stage;
                  setFilters(tempFilters);
                }
              }
            }}
          />
          <Input
            key="itemTermInput"
            placeholder="Type of item"
            type="select"
            options={itemTypes}
            select="select"
            tight
            value={filters.geometry}
            onChange={e => {
              if (e) {
                if (e.value) {
                  setFilters({ ...filters, geometry: e.value });
                } else {
                  let tempFilters = { ...filters };
                  delete tempFilters.geometry;
                  setFilters(tempFilters);
                }
              }
            }}
          />
          <Input
            placeholder="Search item properties..."
            tight
            onChange={e => {
              setSearchTerm(e.target.value);
            }}
            unit={
              <i
                className="fas fa-search"
                style={{ position: "relative", top: "0.09em" }}
              />
            }
          />
          <Button
            variant="secondary"
            type="reset"
            className="w-100"
            onClick={() => {
              clearAll();
            }}
          >
            <i className="fa fa-trash pr-2" style={{ width: "" }} />
            <b>Clear all filters</b>
          </Button>
        </form>
      </div>
      {props.view === "projectTree" && <ProjectTree data={results} />}
      {props.view === "projects" && <Projects data={results} />}
      {props.children}
    </>
  );
};
