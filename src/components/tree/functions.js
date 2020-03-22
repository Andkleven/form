export const searchProjects = (data, terms) => {
  const excludedTerms = [
    "ItemNode",
    "DescriptionNode",
    "ItemNode",
    "foreignKey"
  ];

  let results = [];

  if (data) {
    const findAllProjects = data => {
      if (data.projects) {
        const projects = data.projects;
        return projects;
      }
    };

    const projects = findAllProjects(data);

    const hasChildren = element => {
      const isNonEmptyObject =
        element &&
        element.constructor === Object &&
        Object.entries(element).length > 0;
      const isNonEmptyArray =
        Array.isArray(element) &&
        element.length > 0 &&
        typeof element !== "string";
      if (isNonEmptyObject || isNonEmptyArray) {
        return true;
      }
      return false;
    };

    const elementOrChildrenMatches = (element, term) => {
      let match = false;

      const recurse = (element, term) => {
        if (!excludedTerms.includes(element)) {
          if (match === true) {
            // May not be necessary
            return;
          } else {
            if (
              typeof element === "string" &&
              element.toLowerCase().includes(term)
            ) {
              match = true;
              return;
            } else if (hasChildren(element)) {
              element = Object.entries(element);
              element.forEach(child => {
                const childElement = child[1];
                recurse(childElement, term);
              });
            }
          }
        }
      };

      recurse(element, term);

      return match;
    };

    const projectNotInResults = (project, results) => {
      return !results.includes(project);
    };

    const resultsIntersection = resultsArray => {
      let intersectingResults = resultsArray.shift();
      resultsArray.forEach(results => {
        intersectingResults = intersectingResults.filter(x =>
          results.includes(x)
        );
      });
      return intersectingResults;
    };

    const getMatchingProjects = (projects, terms) => {
      let resultsArray = [];
      terms.forEach(term => {
        if (term === null) {
          term = "";
        }
        let termResults = [];
        term = term.toLowerCase();
        if (projects && Array.isArray(projects)) {
          projects.forEach(project => {
            if (projectNotInResults(project, results)) {
              if (term === "leadengineer" && !project.leadEngineerDone) {
                termResults.push(project);
              } else if (
                term === "qualitycontrol" &&
                !project.leadEngineerDone
              ) {
                termResults.push(project);
              } else if (elementOrChildrenMatches(project, term)) {
                termResults.push(project);
              }
            }
          });
        }
        resultsArray.push(termResults);
      });
      results = resultsIntersection(resultsArray);
    };
    getMatchingProjects(projects, terms);
  }
  return results;
};

export const search = (data, filters, search) => {
  // Search function that returns data containing
  // only items that matches the applied filters
  // and search terms.

  // console.log("- - - - - - - - - - - - New search - - - - - - - - - - - -");
  // console.log("Data:\t\t", data);
  // console.log("Filters:\t", filters);
  // console.log("Search term:\t", search);

  // No search is done if there is no data
  // or if data is not a valid object.
  if (!data) return;

  // Do not search unless filters or search active
  const activeFilters = filters && Object.keys(filters).length;
  const activeItemFilters = (filters.stage && 1) || 0;
  const activeDescriptionFilters = (filters.geometry && 1) || 0;

  const activeSearches = (search !== "" && 1) || 0;

  const activeSearchAndFilters = activeSearches + activeFilters;
  // console.log("Active filters:\t", activeSearchAndFilters);
  if (activeSearchAndFilters === 0) return data.projects;

  // console.log("- - - - - - - - - - - - Searching... - - - - - - - - - - -");

  const matchesSearch = (key, value) => {
    if (typeof value === "string" && value.includes(search)) return true;
    return false;
  };

  const matchesItemFilters = (key, value) => {
    if (key === "stage") {
      if (typeof value === "string" && value === filters.stage) {
        return true;
      }
    }
  };

  const matchesDescriptionFilters = description => {
    if (description.data.geometry === filters.geometry) {
      return true;
    }
    return false;
  };

  const matchingItem = item => {
    if (activeSearches || activeItemFilters) {
      let matches = 0;
      if (search) {
        if (loopTroughData(item, matchesSearch)) matches += 1;
      }
      if (activeItemFilters > 0) {
        if (loopTroughData(item, matchesItemFilters))
          matches += activeItemFilters;
      }
      if (matches === activeItemFilters + activeSearches) {
        return item;
      }
    } else {
      return item;
    }
  };

  const searchDescription = description => {
    let matches = [];
    description.items.forEach(item => {
      const results = matchingItem(item);
      if (results) {
        matches.push(results);
      }
    });
    if (matches.length > 0) {
      const results = { items: matches };
      return results;
    }
  };

  const searchProject = project => {
    let matches = [];
    project.descriptions.forEach(description => {
      let results = searchDescription(description);
      if (results && elementHasChildren(results)) {
        if (
          !activeDescriptionFilters ||
          matchesDescriptionFilters(description)
        ) {
          results.data = description.data;
          matches.push(results);
        }
      }
    });
    if (matches.length > 0) {
      const results = { descriptions: matches };
      return results;
    }
  };

  const searchData = data => {
    let matches = [];
    data.projects.forEach(project => {
      // console.log("!project:\t", project);
      let results = searchProject(project);
      if (results && elementHasChildren(results)) {
        results.data = project.data;
        matches.push(results);
      }
    });
    // if (matches.length > 0) {
    // const results = { projects: matches };
    const results = matches;
    return results;
    // }
  };

  let results = searchData(data);
  // console.log("Results:", results);
  return results;
};

// let tabs = ""; // Can be deleted - only for development

// const deltaTab = (direction, tabs) => {
//   // Can be deleted - only for development
//   if (direction) {
//     // console.log(`${tabs}Recursion DOWN`);
//     tabs += "  ";
//   } else {
//     // console.log(`${tabs}Recursion UP`);
//     tabs = tabs.slice(0, -2);
//   }
//   return tabs;
// };

const loopTroughData = (data, func, oldPath = null) => {
  // Loops through data and executes a given function with
  // key and value arguments for all elements in data.
  let match = false;

  const recurse = (data, func, oldPath) => {
    let path;
    const keys = Object.keys(data);
    // console.log(`${tabs}Keys:\t\t`, keys);
    keys.forEach(key => {
      path = oldPath === null ? key : oldPath + "." + key;
      let value = data[key];
      if (key[0] === "_") {
        // Ignore irrelevant keys
      } else if (elementHasChildren(value)) {
        if (Array.isArray(value)) {
          value.forEach((value, index) => {
            const newPath = path + "." + index.toString();
            // tabs = deltaTab(1, tabs); // Can be deleted - only for development
            loopTroughData(value, func, newPath);
            // tabs = deltaTab(0, tabs); // Can be deleted - only for development
          });
        }
        // tabs = deltaTab(1, tabs); // Can be deleted - only for development
        loopTroughData(value, func, oldPath);
        // tabs = deltaTab(0, tabs); // Can be deleted - only for development
      } else {
        if (func(key, value)) {
          // console.log("loopTroughData's passed function returned true");
          match = true;
          return true;
        }
      }
    });
  };

  recurse(data, func, oldPath);

  return match;
};

const elementHasChildren = element => {
  const isNonEmptyObject =
    element &&
    element.constructor === Object &&
    Object.entries(element).length > 0;
  const isNonEmptyArray =
    Array.isArray(element) && element.length > 0 && typeof element !== "string";
  if (isNonEmptyObject || isNonEmptyArray) {
    return true;
  }
  return false;
};
