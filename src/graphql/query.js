import gql from "graphql-tag";

const ALL = gql`
  query($id: Int) {
    projects(id: $id) {
      id
      data
      leadEngineerDone
      descriptions {
        id
        data
        items {
          id
          itemId
          unique
          qrCode
          repair
          operatorDone
          qualityControlDone
          leadEngineers {
            id
            data
            measurementPointActualTdvs {
              id
              data
            }
            rubberCements {
              id
              data
            }
            vulcanizationSteps {
              id
              data
              coatingLayers {
                id
                data
                cumulativeThickness {
                  id
                  data
                }
              }
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
  query($id: Int) {
    descriptions(id: $id) {
      data
    }
  }
`;

const GET_ORDER_GEOMETRY = gql`
  query($id: Int) {
    projects(id: $id) {
      id
      data
      leadEngineerDone
      descriptions {
        id
        data
        items {
          id
          itemId
          unique
        }
        uploadFiles {
          id
          file
          fileDescription
        }
      }
    }
  }
`;

const GET_LEAD_ENGINEER = gql`
  query getLeadEngineer($id: Int) {
    leadEngineers(item: $id) {
      id
      data
      measurementPointActualTdvs {
        id
        data
      }
      vulcanizationSteps {
        id
        data
        coatingLayers {
          id
          data

          cumulativeThickness {
            id
            data
          }
        }
      }
      rubberCements {
        id
        data
      }
    }
  }
`;

const GET_OPERATOR_BY_DESCRIPTION = gql`
  query($id: Int) {
    descriptions(id: $id) {
      id
      data
      items {
        id
        itemId
        stage
        leadEngineers {
          id
          data
          measurementPointActualTdvs {
            id
            data
          }
          rubberCements {
            id
            data
          }
          vulcanizationSteps {
            id
            data
            coatingLayers {
              id
              data
              cumulativeThickness {
                id
                data
              }
            }
          }
        }
        operators {
          id
          data
          measurementPointActualTdvs {
            id
            data
          }
          vulcanizationOperators {
            id
            data
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
            measurementPointOperators {
              id
              data
            }
          }
        }
      }
    }
  }
`;

const GET_OPERATOR_BY_ITEM = gql`
  query($id: Int) {
    items(id: $id) {
      id
      itemId
      stage
      leadEngineers {
        id
        data
        measurementPointActualTdvs {
          id
          data
        }
        rubberCements {
          id
          data
        }
        vulcanizationSteps {
          id
          data
          coatingLayers {
            id
            data
            cumulativeThickness {
              id
              data
            }
          }
        }
      }
      operators {
        id
        data
        measurementPointActualTdvs {
          id
          data
        }
        vulcanizationOperators {
          id
          data
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
          measurementPointOperators {
            id
            data
          }
        }
      }
    }
  }
`;

const OPERATOR_PROJECTS = gql`
  query($leadEngineerDone: Boolean) {
    projects(leadEngineerDone: $leadEngineerDone) {
      leadEngineerDone
      data
      id
      descriptions {
        data
        items {
          stage
          id
          itemId
        }
      }
    }
  }
`;

const QUALITY_CONTROL = gql`
  query($id: Int) {
    items(id: $id) {
      id
      itemId
      unique
      qrCode
      repair
      operatorDone
      qualityControlDone
      leadEngineers {
        id
        data
        measurementPointActualTdvs {
          id
          data
        }
        vulcanizationSteps {
          id
          data
          coatingLayers {
            id
            data
            cumulativeThickness {
              id
              data
            }
          }
        }
        rubberCements {
          id
          data
        }
      }
      operators {
        id
        data
        measurementPointActualTdvs {
          id
          data
        }
        vulcanizationOperators {
          id
          data
          coatingOperators {
            id
            data
            measurementPointOperators {
              id
              data
            }
          }
          measurementPointOperators {
            id
            data
          }
        }
      }
      finalInspectionQualityControls {
        id
        data
        measurementPointQualityControls {
          id
          data
        }
        hardnessQualityControls {
          id
          data
        }
        peelTestQualityControls {
          id
          data
        }
        uploadFiles {
          id
          file
          fileDescription
        }
      }
    }
  }
`;


const USERS = gql`
  query($role: [String]) {
    userProfile(role: $role) {
        id
        name
        role
    }
  }
`;

const DEFAULT = gql`
  query($name: String) {
    query(name: $name){
      id
    }      
  }
`;

const query = {
  ALL,
  GET_ORDER_GEOMETRY,
  GET_LEAD_ENGINEER,
  GET_GEOMETRY,
  GET_ORDER,
  GET_OPERATOR_BY_DESCRIPTION,
  GET_OPERATOR_BY_ITEM,
  OPERATOR_PROJECTS,
  QUALITY_CONTROL,
  USERS,
  DEFAULT
};
export default query;
