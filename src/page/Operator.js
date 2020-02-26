import React from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import Paper from "components/Paper";
import Tree from "components/tree/Tree";
import { stringToDictionary } from "components/Functions";

export default () => {
  const { loading, error, data } = useQuery(query["OPERATOR_PROJECTS"], {
    variables: { leadEngineerDone: true, operatorDone: false }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <>
      <Paper>
        <div className="" style={{ fontWeight: 600 }}>
          Projects
        </div>
        {data.createProject.map((project, index) => (
          <Tree
            key={index}
            name={`${project.data &&
              stringToDictionary(project.data).projectName}`}
            defaultOpen
          >
            {project.category &&
              project.category.map((category, index) => (
                <Tree
                  key={index}
                  name={`${category.data &&
                    stringToDictionary(category.data).geometry}`}
                >
                  {category.item &&
                    category.item.map((item, index) => (
                      <Tree link key={index} name={item.id} />
                    ))}
                </Tree>
              ))}
          </Tree>
        ))}
        {/* <Tree name="main" defaultOpen>
          <Tree name="hello" />
          <Tree name="subtree with children">
            <Tree name="hello" />
            <Tree name="sub-subtree with children">
              <Tree name="child 1" style={{ color: "#37ceff" }} />
              <Tree name="child 2" style={{ color: "#37ceff" }} />
              <Tree name="child 3" style={{ color: "#37ceff" }} />
              <Tree name="custom content">
                <div
                  className="position-relative w-100"
                  style={{
                    height: 200,
                    padding: 10
                  }}
                >
                  <div
                    className="shadow-sm border rounded h-100 w-100"
                    style={{
                      background: "white"
                    }}
                  />
                </div>
              </Tree>
            </Tree>
            <Tree name="hello" />
          </Tree>
          <Tree name="world" />
          <Tree name={<span>🙀 something something</span>} />
        </Tree> */}
      </Paper>
    </>
  );
};
