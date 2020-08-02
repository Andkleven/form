export const focusNextInput = e => {
  const form = e.target.form;
  const index = Array.prototype.indexOf.call(form, e.target);

  const currentElement = form.elements[index];
  const isSelect = element => element.id.includes("react-select-");

  const skip = (e, skipElements = 1) => {
    while (index + skipElements <= form.elements.length) {
      const element = form.elements[index + skipElements];
      if (element) {
        if (
          ["INPUT", "TEXTAREA"].includes(element.tagName) ||
          element.type === "submit"
        ) {
          if (element.hidden) {
            element.parentElement.focus();
          }
          element.focus();
          break;
        }
      } else {
      }
      skipElements += 1;
    }
  };

  if (isSelect(currentElement)) {
    // Select
    // react-select inputs contains 3 inputs, so we have to skip these

    /**
     * Temporary attempt at better UX for selects
     *
     * A better fix may be to change submit buttons type to "button",
     * as this allows for more flexibility and a more uniform solution
     * for different inputs.
     */
    if (e.key === "Enter") {
      console.log("Is select");
      if (e.target.value) {
        skip(e, 3);
      } else {
        e.preventDefault();
        skip(e, 3);
      }
    }
  } else {
    // Input and text area
    e.preventDefault();
    skip(e);
  }
};
