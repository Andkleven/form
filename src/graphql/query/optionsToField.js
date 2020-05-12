import gql from "graphql-tag";


const OFFSITE = gql`
  query($role: [String]) {
    userProfile(role: $role) {
        id
        name
    }
  }
`;

const optionsToField = {
    OFFSITE
  };
  export default optionsToField;