// const userInfo = JSON.parse(localStorage.getItem("user")); // Local user info
import roles from "config/roles.json";

/**
 * Returns user as an object.
 * @return {object} User
 */
export function getUser(): object {
  return JSON.parse(localStorage.getItem("user") || "{}");
}

/**
 * Returns access as an object combined with an optional customAccess.
 * @param {object} customAccess Custom permissions
 * @return {object} Access
 */
export function getAccess(customAccess: object): object {
  let access: object = {};

  const user = getUser();

  try {
    const role = user["role"].toLowerCase();
    const defaultAccess = roles[role]["access"];
    if (customAccess) {
      access = { ...defaultAccess, ...customAccess };
    }
  } catch (error) {
    alert(
      `User access failed with the following error:\n${error}\nPlease contact your administrator.`
    );
  }

  return access;
}
