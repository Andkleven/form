/**
 * See https://github.com/react-spring/react-spring/issues/668
 * Disabling animation might be available soon.
 * This could be used for performance/cross platform compatibility.
 * Import this file in App.js to enable.
 */

import { Globals } from "react-spring";

Globals.assign({
  skipAnimation: true
});
