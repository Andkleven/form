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
  const activeItemFilters =
    (filters.stage && filters.stage !== "leadEngineer" && 1) || 0;
  const activeDescriptionFilters = (filters.geometry && 1) || 0;
  const activeProjectFilters = (filters.stage && 1) || 0;
  // const activeFilters = filters && Object.keys(filters).length;
  const activeFilters =
    activeItemFilters + activeDescriptionFilters + activeProjectFilters;

  const activeSearches = (search !== "" && 1) || 0;
  const activeSearchAndFilters = activeSearches + activeFilters;

  //   console.log("Item\tDesc\tProj\tItSr\tSUM");
  //   console.log(
  //     `${activeItemFilters}   +\t\
  // ${activeDescriptionFilters}   +\t\
  // ${activeProjectFilters}   +\t\
  // ${activeSearches}   =\t\
  // ${activeSearchAndFilters}`
  //   );

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

  const matchesProjectFilters = project => {
    if (activeProjectFilters === 0) {
      return true;
    }

    if (filters.stage === "leadEngineer") {
      if (project.leadEngineerDone === false) {
        return true;
      }
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
        if (!activeProjectFilters || matchesProjectFilters(project)) {
          results.data = project.data;
          matches.push(results);
        }
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
