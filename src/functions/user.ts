// const userInfo = JSON.parse(localStorage.getItem("user")); // Local user info

export const roles: {
  admin: string;
  lead: string;
  operator: string;
  quality: string;
} = {
  admin: "ADMIN",
  lead: "LEAD_ENGINEER",
  operator: "OPERATOR",
  quality: "QUALITY_CONTROL"
};

export function getUser(): object {
  return JSON.parse(localStorage.getItem("user") || "{}");
}

export function getRole(user: object): string {
  return user["role"];
}

export function displayRole(role: string): string {
  switch (role) {
    case roles.admin:
      return "Administrator";
    case roles.lead:
      return "Lead Engineer";
    case roles.operator:
      return "Operator";
    case roles.quality:
      return "Quality Control";
    default:
      return "None";
  }
}
