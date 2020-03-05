import React, { useState } from "react";
import Tree from "components/tree/Tree";
import Input from "components/Input";
import { searchProjects } from "components/Functions";
import stagesJson from "components/stages/Stages.json";
import { Link } from "react-router-dom";

export default props => {
  const stages = stagesJson.all;

  const [stageTerm, setStageTerm] = useState("");
  const [searchTerms, setSearchTerms] = useState("");

  const sumTerms = [stageTerm, searchTerms];
  const results = searchProjects(props.data, sumTerms);

  const iconStyle = {
    color: "#f1b25b",
    position: "relative",
    // top: "0.1em",
    right: "0.25em",
    width: "1.5em",
    textAlign: "center"
    // widthRigth: "5em"
  };

  console.log(results);

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
          onChange={e => {
            if (e) {
              setStageTerm(e.value);
            }
          }}
        />
        <Input
          placeholder="Search..."
          tight
          onChange={e => {
            setSearchTerms(e.target.value);
          }}
          unit={
            <i
              className="fas fa-search"
              style={{ position: "relative", top: "0.09em" }}
            />
          }
        />
      </div>
      {props.children}
      <h6 className="mb-0">Projects</h6>
      {results && results.length > 0 ? (
        results.map(
          (project, index) =>
            project.data && ( // Adresses crash on revisit,
              <Tree defaultOpen key={index} name={project.data.projectName}>
                {project.descriptions &&
                  project.descriptions.map((description, index) => (
                    <Tree
                      defaultOpen
                      key={index}
                      name={description.data.geometry}
                    >
                      <Link
                        className="d-flex"
                        to={`/order/item/${description.data.description}`}
                      >
                        <div className="pt-2">
                          <i className="fas fa-cubes" style={iconStyle} />
                          Batch all items in folder
                        </div>
                      </Link>
                      {description.items &&
                        description.items.map((item, index) => (
                          <Link
                            className="d-flex"
                            to={`/order/lead-engineer/1/${item.id}/1`}
                            key={index}
                          >
                            <div className="pt-2">
                              <i className="fas fa-cube" style={iconStyle} />
                              {item.id}
                            </div>
                          </Link>
                          // <Tree defaultOpen item key={index} name={item.id} />
                        ))}
                    </Tree>
                  ))}
              </Tree>
            ) // Adresses crash on revisit,
        )
      ) : (
        <div className="pt-1">No projects available.</div>
      )}
    </>
  );
};
