import React, { useEffect, useRef } from "react";

/**
 * Place this where you want to auto scroll to.
 * Render only one at a time.
 */
export default ({ id }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  return <div ref={scrollRef} />;
};
