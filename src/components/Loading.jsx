import React, { useRef, useEffect } from "react";
import Div100vh from "react-div-100vh";
import MoonLoader from "react-spinners/MoonLoader";

/**
 * Fullscreen loading that blocks user input
 * @param {bool} loading Optional conditional loading, if render is not conditional
 */
export default ({ loading = true }) => {
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

  return (
    <Div100vh
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      <div
        style={{ width: "100%", height: "100%" }}
        className="d-flex justify-content-center align-items-center flex-column"
      >
        <MoonLoader size={100} color={"#ffffff"} loading={loading} />
        <div style={{ position: "relative", bottom: 77.5, color: "#ffffff" }}>
          Loading
          <span ref={dots} />
        </div>
      </div>
    </Div100vh>
  );
};
