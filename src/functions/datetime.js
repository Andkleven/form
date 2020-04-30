import { isStringInstance } from "functions/general";

/**
 * Converts date and datetime to correct string formats
 * @param {object}  datetime Date or datetime to convert
 * @param {string}  type     Type of object to convert, "date" or "datatime-local"
 * @return {string} Properly formatted initials.
 */
export function convertDatetimeToString(datetime, type) {
  let datetimeString;

  if (["date", "datetime-local"].includes(type)) {
    if (isStringInstance(datetime)) {
      datetime = null;
    }

    if (datetime) {
      const year = new Intl.DateTimeFormat("no", {
        year: "numeric"
      }).format(datetime);
      const month = new Intl.DateTimeFormat("no", {
        // month: "short"
        month: "long"
      }).format(datetime);
      const day = new Intl.DateTimeFormat("no", { day: "numeric" }).format(
        datetime
      );
      datetimeString = `${day}. ${month} ${year}`;
      if (type === "datetime-local") {
        const hour = new Intl.DateTimeFormat("no", {
          hour: "2-digit"
        }).format(datetime);
        let minute = new Intl.DateTimeFormat("no", {
          minute: "2-digit"
        }).format(datetime);
        if (minute === "0") minute = "00";
        datetimeString += ` ${hour}:${minute}`;
      }
    }
  }

  return datetimeString;
}
