import { isMobile, isTablet } from "react-device-detect";
// import { useState, useEffect } from "react";

// function getWindowDimensions() {
//   const { innerWidth: width, innerHeight: height } = window;
//   return {
//     width,
//     height
//   };
// }

// function useWindowDimensions() {
//   const [windowDimensions, setWindowDimensions] = useState(
//     getWindowDimensions()
//   );

//   useEffect(() => {
//     function handleResize() {
//       setWindowDimensions(getWindowDimensions());
//     }

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return windowDimensions;
// }

// function bootstrapSize() {
//   const deviceWidth = useWindowDimensions().width;
//   console.log(deviceWidth);
//   if (deviceWidth < 576) return "sm";
//   if (deviceWidth < 768) return "md";
//   if (deviceWidth < 992) return "lg";
//   if (deviceWidth < 1200) return "xl";
// }

export const touch = () => {
  return (
    isMobile || isTablet
    // || bootstrapSize() === "sm"
  );
};
