// const userInfo = JSON.parse(localStorage.getItem("user")); // Local user info
import defaultRoles from "config/access.json";

export function access(customAccess: object): object {
  const user: { role: string; username: string } = JSON.parse(
    localStorage.getItem("user") || "{}"
  );
  const defaultAccess = defaultRoles[user.role.toLowerCase()];
  if (customAccess) {
    return { ...defaultAccess, ...customAccess };
  }
  return defaultAccess;
}

export function displayRole(role: string): string {
  switch (role) {
    case "admin":
      return "Administrator";
    case "lead":
      return "Lead Engineer";
    case "operator":
      return "Operator";
    case "quality":
      return "Quality Control";
    case "spectator":
      return "Spectator";
    case "offsite":
      return "Offsite Responsible";
    default:
      return "None";
  }
}
