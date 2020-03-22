import React, { useState } from "react";
import Tree from "components/tree/Tree";
import Input from "components/Input";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { search } from "./functions";

import stagesJson from "components/stages/Stages.json";

const createStages = operatorStages => {
  let stages = operatorStages.all;
  stages.unshift("leadEngineer");
  stages.push("qualityControl");
  return stages;
};

const stages = createStages(stagesJson);
const itemTypes = ["Coated Item", "Mould"];

export default props => {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const results = search(props.data, filters, searchTerm);

  const clearAll = () => {
    setFilters({});
    setSearchTerm("");
  };

  const itemIconStyle = {
    color: "#bbbbbb",
    position: "relative",
    right: "0.25em",
    width: "1.5em",
    textAlign: "center"
  };

  const linkStyle = {
    color: "#dddddd"
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
      {props.children}
      <h6 className="mb-0">Projects</h6>
      {results && results.length > 0 ? (
        results.map(
          (project, indexProject) => (
            // project.data ? ( // Adresses crash on revisit,
            <Tree
              defaultOpen
              key={`project${indexProject}`}
              name={project.data.projectName}
            >
              {project.descriptions &&
                project.descriptions.map((description, indexDescription) => (
                  <Tree
                    defaultOpen
                    key={`project${indexProject}Description${indexDescription}`}
                    name={description.data.geometry}
                  >
                    <Link
                      className="d-flex unselectable"
                      to={`/order/item/${description.data.description}`}
                      style={linkStyle}
                    >
                      {description.items.length > 1 && (
                        <div className="pt-2 unselectable">
                          <i className="fad fa-cubes" style={itemIconStyle} />
                          Batch items
                        </div>
                      )}
                    </Link>
                    {description.items &&
                      description.items.map((item, indexItem) => (
                        <Link
                          className="d-flex"
                          to={`/order/lead-engineer/1/${item.id}/1`}
                          key={`project${indexProject}Description${indexDescription}Item${indexItem}`}
                          style={linkStyle}
                        >
                          <div className="pt-2 unselectable">
                            <i className="fad fa-cube" style={itemIconStyle} />
                            {item.id}
                          </div>
                        </Link>
                      ))}
                  </Tree>
                ))}
            </Tree>
          )
          // ) : (
          //   <div className="pt-1">
          //     Data missing -{" "}
          //     <a onClick={() => window.location.reload()} href=" ">
          //       refreshing the page
          //     </a>{" "}
          //     might fix this.
          //   </div>
          // ) // Adresses crash on revisit,
        )
      ) : (
        <div className="pt-1">No projects found.</div>
      )}
    </>
  );
};
