import React, { useState } from "react";
import Input from "components/input/Input";
import { search } from "../functions/search";
import Projects from "./Projects";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DarkButton from "components/button/DarkButton";
import { getUser } from "functions/user";
import DepthButton from "components/button/DepthButton";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";

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

  let results = props.data.projects;

  // Project Search
  // ______________________________________________________
  const [projectTerm, setProjectTerm] = useState("");
  const projectIndexes = results
    .map((project, index) => {
      const searchables = [
        project["data"]["projectNumber"],
        project["data"]["projectName"]
      ];

      let match = false;

      searchables.forEach(searchable => {
        if (!match) {
          if (searchable.toLowerCase().includes(projectTerm.toLowerCase())) {
            match = true;
          }
        }
      });

      return match && index;
    })
    .filter(Number);

  if (projectTerm !== "") {
    results = results
      .map((project, index) => {
        if (projectIndexes.includes(index)) {
          return project;
        }
        return false;
      })
      .filter(project => project !== false);
  }
  // ______________________________________________________

  const [filters, setFilters] = useState(props.defaultFilters || {});
  const [searchTerm, setSearchTerm] = useState(props.defaultSearch || "");
  const [scan, setScan] = useState(false);

  function isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  if (!(isEmpty(filters) && searchTerm === "")) {
    results = search({ projects: results }, filters, searchTerm);
  }

  const clearAll = () => {
    setFilters({});
    setSearchTerm("");
  };

  const [showAdvanced, setShowAdvanced] = useState(false);

  const Search = (
    <>
      <Input
        noComment={true}
        className="mb-1 w-100"
        placeholder="Search for a project"
        tight
        value={projectTerm}
        onChangeInput={e => {
          setProjectTerm(e.target.value);
        }}
        prepend={
          <>
            <div
              style={{
                width: 0,
                height: 0,
                position: "relative",
                bottom: ".8em",
                left: ".5em",
                zIndex: 99
              }}
            >
              <FontAwesomeIcon
                icon={["fas", "search"]}
                className="text-dark"
                size="sm"
                style={{ opacity: 0.75 }}
              />
            </div>
            <FontAwesomeIcon
              icon={["fad", "folder"]}
              style={{ position: "relative", top: "0.09em" }}
            />
          </>
        }
      />
      <div className="d-flex flex-column flex-sm-row w-100">
        <Input
          noComment={true}
          className="mb-1 w-100"
          placeholder="Search for an item"
          tight
          value={searchTerm}
          onChangeInput={e => {
            setSearchTerm(e.target.value);
          }}
          prepend={
            <>
              <div
                style={{
                  width: 0,
                  height: 0,
                  position: "relative",
                  bottom: ".8em",
                  left: ".5em",
                  zIndex: 99
                }}
              >
                <FontAwesomeIcon
                  icon={["fas", "search"]}
                  className="text-dark"
                  size="sm"
                  style={{ opacity: 0.75 }}
                />
              </div>
              <FontAwesomeIcon
                icon={["fad", "cube"]}
                style={{ position: "relative", top: "0.09em" }}
              />
            </>
          }
        />

        <DepthButton
          short
          className="mb-1 mb-sm-0 ml-sm-1 h-100"
          onClick={() => {
            setScan(!scan);
          }}
        >
          <div className="d-flex align-items-center justify-content-center">
            <FontAwesomeIcon
              className="text-dark"
              icon={["fas", scan ? "caret-up" : "qrcode"]}
              // color="rgba(0, 0, 0, 0.75)"
            />
            <span className="ml-2">{scan ? "Cancel" : "Scan"}</span>
          </div>
        </DepthButton>
      </div>
      {scan && (
        <>
          <div className="rounded">
            <BarcodeScannerComponent
              width={"100%"}
              onUpdate={(err, result) => {
                if (result) {
                  setSearchTerm(result.text);
                  setScan(false);
                }
              }}
            />
          </div>
          <div
            className="w-100 d-flex flex-column justify-content-center align-items-center mb-3"
            // style={{ position: "relative", height: 0, bottom: 0, zIndex: 0 }}
          >
            <div>
              <b>Camera not working? Try to...</b>
              <ul className="">
                <li>Enable the webcam</li>
                <li>Check browser permissions</li>
                <li>Use another browser</li>
                <li>Contact your administrator</li>
              </ul>
            </div>
            {/* <div className="text-center">
              <div className="mt-2">
                <small>
                  <i>Note to developers:</i>
                </small>
              </div>
              <div>
                <small>
                  <i>This only works in production</i>
                </small>
              </div>
            </div> */}
          </div>
        </>
      )}
    </>
  );

  const Stage = (
    <Input
      selectAutoFormat
      noComment={true}
      className="mb-1"
      key="stageTermInput"
      placeholder="Stage"
      type="select"
      options={stages}
      select="select"
      tight
      value={filters.stage ? filters.stage : ""}
      onChangeSelect={e => {
        if (e) {
          setTimeout(() => {}, 1000);
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
      selectAutoFormat
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

  const searchActive =
    projectTerm !== "" || !isEmpty(filters) || searchTerm !== "";

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
        searchActive={searchActive}
      />
    </>
  );
};
