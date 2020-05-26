// const userInfo = JSON.parse(localStorage.getItem("user")); // Local user info
import defaultRoles from "config/roles.json";

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
    case "supervisor":
      return "Supervisor";
    case "operator":
      return "Operator";
    case "quality":
      return "Quality Control";
    case "offsite":
      return "Offsite Responsible";
    case "spectator":
      return "Spectator";
    default:
      return "None";
  }
}
