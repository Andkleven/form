import React, { useState } from "react";
import Tree from "components/tree/Tree";
import Input from "components/Input";
import { searchProjects } from "components/Functions";

export default props => {
  const [results, setResults] = useState(searchProjects(props.data, ""));

  return (
    <>
      <h6 className="pb-1">Filter</h6>
      <div className="mb-3">
        <Input
          placeholder="Search..."
          tight
          onChange={e => {
            setResults(searchProjects(props.data, e.target.value));
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
        results.map((project, index) => (
          <Tree defaultOpen key={index} name={project.data.projectName}>
            {project.descriptions &&
              project.descriptions.map((description, index) => (
                <Tree defaultOpen key={index} name={description.data.geometry}>
                  {description.items &&
                    description.items.map((item, index) => (
                      <Tree defaultOpen check key={index} name={item.id} />
                    ))}
                </Tree>
              ))}
          </Tree>
        ))
      ) : (
        <div className="pt-1">No projects available.</div>
      )}
    </>
  );
};
