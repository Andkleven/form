import React from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import Paper from "components/Paper";
import Tree from "components/tree/Tree";
import FilterTree from "components/tree/FilterTree";
import { expandJson } from "components/Functions";

export default () => {
  const { loading, error, data } = expandJson(
    useQuery(query["OPERATOR_PROJECTS"], {
      variables: { leadEngineerDone: true, operatorDone: false }
    })
  );
  // console.log(data);

  // const raw = {
  //   item1: { key: "sdfd", value: "sdfd" },
  //   item2: { key: "sdfd", value: "sdfd" },
  //   item3: { key: "sdfd", value: "sdfd" }
  // };

  // const allowed = ["item1", "item3"];

  // const filtered = Object.keys(raw)
  //   .filter(key => allowed.includes(key))
  //   .reduce((obj, key) => {
  //     obj[key] = raw[key];
  //     return obj;
  //   }, {});

  // console.log(raw);
  // console.log(filtered);

  //_________________________________________

  // const fruits = ["apple", "banana", "grapes", "mango", "orange"];

  // /**
  //  * Filter array items based on search criteria (query)
  //  */
  // const filterItems = (arr, query) => {
  //   return arr.filter(
  //     element => element.toLowerCase().indexOf(query.toLowerCase()) !== -1
  //   );
  // };

  // console.log(filterItems(fruits, "ap")); // ['apple', 'grapes']
  // console.log(filterItems(fruits, "an")); // ['banana', 'mango', 'orange']

  //_________________________________________

  const search = (data, searchTerm) => {
    if (data && searchTerm) {
      // const foundEntry = Object.entries(data).filter();
      const result = data;
      return result;
    }
  };
  let results = search(data, "fgggggdgggg");
  console.log(data);
  console.log(results);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <>
      <Paper darkMode>
        {/* <Paper> */}
        <FilterTree />
        <h6 className="mb-0">Projects</h6>
        {results ? (
          results.createProject.map((project, index) => (
            <Tree defaultOpen key={index} name={project.data.projectName}>
              {project.category &&
                project.category.map((category, index) => (
                  <Tree defaultOpen key={index} name={category.data.geometry}>
                    {category.item &&
                      category.item.map((item, index) => (
                        <Tree defaultOpen link key={index} name={item.id} />
                      ))}
                  </Tree>
                ))}
            </Tree>
          ))
        ) : (
          <div className="pt-1">No projects available.</div>
        )}
      </Paper>
    </>
  );
};
