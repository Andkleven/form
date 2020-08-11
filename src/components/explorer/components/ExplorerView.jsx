import React, { useState } from "react";
import Input from "components/input/Input";
import { search } from "../functions/search";
import Projects from "./Projects";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DarkButton from "components/button/DarkButton";
import { getUser } from "functions/user";

const createStages = data => {
  let stages = [];
  let leadEngineer = false;
  let qualityControl = false;

  data.projects.forEach(project => {
    project.leadEngineerDone
      ? project.descriptions.forEach(description => {
          description.items.forEach(item => {
            item.qualityControlDone // Not tested yet
              ? (qualityControl = true)
              : !stages.includes(item.stage) && stages.push(item.stage);
          });
        })
      : (leadEngineer = true);
  });

  // Add LE & QC stages
  leadEngineer && stages.unshift("leadEngineer");
  qualityControl && stages.push("qualityControl");

  return stages;
};

const itemTypes = ["Coated Item", "Mould"];

export default ({ view = "items", ...props }) => {
  const user = getUser();
  const stages = createStages(props.data);

  const [filters, setFilters] = useState(props.defaultFilters || {});
  const [searchTerm, setSearchTerm] = useState(props.defaultSearch || "");
  const results = search(props.data, filters, searchTerm);

  const clearAll = () => {
    setFilters({});
    setSearchTerm("");
  };

  const [showAdvanced, setShowAdvanced] = useState(false);

  const Search = (
    <Input
      noComment={true}
      className="mb-1"
      placeholder="Search"
      tight
      value={searchTerm}
      onChangeInput={e => {
        setSearchTerm(e.target.value);
      }}
      unit={
        <FontAwesomeIcon
          icon="search"
          style={{ position: "relative", top: "0.09em" }}
        />
      }
    />
  );

  const Stage = (
    <Input
      noComment={true}
      className="mb-1"
      key="stageTermInput"
      placeholder="Stage"
      type="select"
      options={stages}
      select="select"
      tight
      value={filters.stage}
      onChangeSelect={e => {
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
  );

  const Type = (
    <Input
      noComment={true}
      className="mb-1"
      key="itemTermInput"
      placeholder="Type of item"
      type="select"
      options={itemTypes}
      select="select"
      tight
      value={filters.geometry}
      onChangeSelect={e => {
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
  );

  const filterStandard = {
    simple: Search,
    advanced: (
      <>
        {Stage}
        {Type}
      </>
    )
  };

  const filterConfig = {
    DEFAULT: filterStandard,
    ADMIN: filterStandard,
    QUALITY: filterStandard,
    LEAD: filterStandard,
    SUPERVISOR: filterStandard,
    OPERATOR: {
      simple: (
        <>
          {Stage}
          {Search}
        </>
      )
    },
    OFFSITE: filterStandard,
    SPECTATOR: filterStandard
  };

  console.log(user.role);

  // console.log("data", props.data);
  // console.log("results", results);
  // console.log("stage", filters["stage"]);

  return (
    <>
      {(!!filterConfig[user.role]["simple"] ||
        !!filterConfig[user.role]["advanced"]) && (
        <div className="mb-3">
          <form id="filterForm">
            {filterConfig[user.role]["simple"]}
            {!!filterConfig[user.role]["advanced"] && (
              <>
                <div hidden={!showAdvanced}>
                  {filterConfig[user.role]["advanced"]}
                </div>
                <div className="d-sm-flex">
                  <DarkButton
                    onClick={() => {
                      setShowAdvanced(!showAdvanced);
                      showAdvanced && clearAll();
                    }}
                    className="mb-1"
                  >
                    <FontAwesomeIcon
                      icon={["fas", showAdvanced ? "caret-up" : "caret-down"]}
                      className="mr-2"
                    />
                    {`${showAdvanced ? "Hide" : "Show"} advanced search`}
                  </DarkButton>
                  <DarkButton
                    onClick={() => {
                      clearAll();
                    }}
                    className="mb-1"
                  >
                    <FontAwesomeIcon
                      icon={["fas", "trash-alt"]}
                      className="mr-2"
                    />
                    Clear all filters
                  </DarkButton>
                </div>
              </>
            )}
          </form>
        </div>
      )}

      <Projects
        {...props}
        results={results}
        data={props.data}
        stage={filters.stage}
      />
    </>
  );
};
