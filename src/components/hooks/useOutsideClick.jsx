import { useEffect } from "react";

/**
 * Hook for handling clicks outside given refs.
 *
 * Inspired by
 * https://medium.com/@kevinfelisilda/click-outside-element-event-using-react-hooks-2c540814b661
 *
 * ...but modified to support multiple refs.
 *
 * @param {Array} refs
 * @param {Function} callback
 */
export default (refs, callback) => {
  const handleClick = e => {
    let outside = 0;

    refs.forEach(ref => {
      if (ref.current && !ref.current.contains(e.target)) {
        outside += 1;
      }
    });

    if (outside === refs.length) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};
