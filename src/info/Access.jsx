import React from "react";
import roles from "config/roles.json";

export default () => {
  return (
    <div>
      <ul>
        {Object.keys(roles).map((role, roleIndex) => (
          <li key={`role-${role}-${roleIndex}`}>
            <div>{roles[role]["displayName"]}</div>
            {Object.keys(roles[role]["access"]).map((feature, accessIndex) => (
              <div>
                {roles[role]["access"][feature] ? "✔️" : "❌"} {feature}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};
