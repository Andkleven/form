import React, { useState } from "react";
import Input from "components/input/Input";
import Button from "react-bootstrap/Button";
import { search } from "../functions/search";
import ProjectTree from "./ProjectTree";
import Projects from "./Projects";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DarkButton from "components/button/DarkButton";

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
  const stages = createStages(props.data);

  const [filters, setFilters] = useState(props.defaultFilters || {});
  const [searchTerm, setSearchTerm] = useState(props.defaultSearch || "");
  const results = search(props.data, filters, searchTerm);

  const clearAll = () => {
    setFilters({});
    setSearchTerm("");
  };

  const Files = () => {
    switch (view) {
      case "all":
        return (
          <>
            <Projects {...props} data={results} className="mb-3" />
            <ProjectTree
              {...props}
              data={results}
              headline="Projects (items)"
            />
          </>
        );
      case "items":
        return <ProjectTree {...props} data={results} />;
      case "projects":
        return <Projects {...props} data={results} />;
      default:
        return null;
    }
  };

  return (
    <>
      <h6 className="pb-1">Filters</h6>
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
          <Input
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
          <Input
            placeholder="Search item properties..."
            tight
            onChange={e => {
              setSearchTerm(e.target.value);
            }}
            unit={
              <FontAwesomeIcon
                icon="search"
                style={{ position: "relative", top: "0.09em" }}
              />
            }
          />
          <DarkButton
            onClick={() => {
              clearAll();
            }}
          >
            <FontAwesomeIcon icon={["fas", "trash-alt"]} className="mr-1" />
            Clear all filters
          </DarkButton>
          {/* <Button
            variant="secondary"
            type="reset"
            className="w-100"
            onClick={() => {
              clearAll();
            }}
          ></Button> */}
        </form>
      </div>
      <Files />
    </>
  );
};
