import React, { useEffect, useRef } from "react";

export default ({ id }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  return <div ref={scrollRef}></div>;
};
