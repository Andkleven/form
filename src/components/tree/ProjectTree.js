import React, { useState } from "react";
import Tree from "components/tree/Tree";
import Input from "components/Input";
import { searchProjects } from "components/Functions";
import stagesJson from "components/stages/Stages.json";

const stages = stagesJson.all;

export default props => {
  const [stageTerm, setStageTerm] = useState("");
  const [searchTerms, setSearchTerms] = useState("");

  const sumTerms = [stageTerm, searchTerms];
  const results = searchProjects(props.data, sumTerms);

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
            // Split may not make list of single word
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
                      {description.items &&
                        description.items.map((item, index) => (
                          <Tree defaultOpen check key={index} name={item.id} />
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
