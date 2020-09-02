// import { isStringInstance } from "functions/general";
import moment from "moment";

/**
 * Converts date and datetime to correct string formats
 * @param {object}  datetime Date or datetime to convert
 * @param {string}  type Type of object to convert, "date" or "datetime-local"
 * @return {string} Properly formatted initials.
 */
export function convertDatetimeToString(datetime, type) {
  switch (type) {
    case "date":
      return moment(datetime).format("D. MMMM YYYY");
    case "datetime-local":
      return moment(datetime).format("D. MMMM YYYY HH:mm");
    default:
      break;
  }
}
