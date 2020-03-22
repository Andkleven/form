import gql from "graphql-tag";

const ALL = gql`
  query($id: Int!) {
    projects(id: $id) {
      id
      data
      leadEngineerDone
      operatorDone
      qualityControlDone
      operatorStarted
      descriptions {
        id
        data
        items {
          id
          data
          different
          qrCode
          repair
          operatorDone
          qualityControlDone
          leadEngineers {
            id
            data
            measurementPointActualTvds {
              id
              data
            }
            customSteelPreparations {
              id
              data
            }
            rubberCements {
              id
              data
            }
            customFinalInspections {
              id
              data
            }
            vulcanizationSteps {
              id
              data
            }
            coatingLayers {
              id
              data
            }
          }
        }
      }
    }
  }
`;

const GET_ORDER = gql`
  {
    projects(qualityControlDone: false) {
      id
      data
    }
  }
`;

const GET_GEOMETRY = gql`
  query($id: Int!) {
    descriptions(id: $id) {
      data
    }
  }
`;

const GET_ORDER_GEOMETRY = gql`
  query($id: Int!) {
    projects(id: $id) {
      id
      data
      leadEngineerDone
      descriptions {
        id
        data
        items {
          id
          data
          different
        }
        uploadFiles {
          id
          file
          data
        }
      }
    }
  }
`;

const GET_LEAD_ENGINEER = gql`
  query getLeadEngineer($id: Int!) {
    leadEngineers(item: $id) {
      id
      data
      customSteelPreparations {
        id
        data
      }
      measurementPointActualTvds {
        id
        data
      }
      vulcanizationSteps {
        id
        data
      }
      coatingLayers {
        id
        data
      }
      rubberCements {
        id
        data
      }
      customFinalInspections {
        id
        data
      }
    }
  }
`;

const GET_OPERATOR = gql`
  query($id: Int!) {
    descriptions(id: $id) {
      id
      data
      items {
        id
        data
        stage
        leadEngineers {
          id
          data
          measurementPointActualTvds {
            id
            data
          }
          customSteelPreparations {
            id
            data
          }
          rubberCements {
            id
            data
          }
          customFinalInspections {
            id
            data
          }
          vulcanizationSteps {
            id
            data
          }
          coatingLayers {
            id
            data
          }
        }
        operators {
          id
          data
          customMediaBlastings {
            id
            data
          }
          coatingOperators {
            id
            data
            mixDates {
              id
              data
            }
            measurementPointOperators {
              id
              data
            }
          }
          vulcanizationOperators {
            id
            data
          }
        }
      }
    }
  }
`;

const OPERATOR_PROJECTS = gql`
  query($leadEngineerDone: Boolean, $operatorDone: Boolean) {
    projects(leadEngineerDone: $leadEngineerDone, operatorDone: $operatorDone) {
      leadEngineerDone
      data
      descriptions {
        data
        items {
          stage
          id
          operatorDone
          qualityControlDone
          data
        }
      }
    }
  }
`;

const query = {
  ALL,
  GET_ORDER_GEOMETRY,
  GET_LEAD_ENGINEER,
  GET_GEOMETRY,
  GET_ORDER,
  GET_OPERATOR,
  OPERATOR_PROJECTS
};
export default query;
