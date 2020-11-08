import React, { useRef, useEffect } from "react";

export default () => {
  const dots = useRef();
  useEffect(() => {
    setInterval(() => {
      if (dots.current) {
        if (dots.current.innerHTML.length >= 3) {
          dots.current.innerHTML = "";
        } else {
          dots.current.innerHTML += ".";
        }
      }
    }, 350);
  }, [dots]);

  return <span ref={dots} />;
};
