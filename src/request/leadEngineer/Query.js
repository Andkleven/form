import gql from "graphql-tag";

const ALL = gql`
  query($id: Int) {
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
          itemId
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
                cumulativeThicknes {
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
          different
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
      measurementPointActualTvds {
        id
        data
      }
      vulcanizationSteps {
        id
        data
        coatingLayers {
          id
          data
          cumulativeThicknes {
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
          measurementPointActualTvds {
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
              cumulativeThicknes {
                id
                data
              }
            }
          }
        }
        operators {
          id
          data
          measurementPointActualTvds {
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
        measurementPointActualTvds {
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
            cumulativeThicknes {
              id
              data
            }
          }
        }
      }
      operators {
        id
        data
        measurementPointActualTvds {
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
    }
  }
`;

const OPERATOR_PROJECTS = gql`
  query($leadEngineerDone: Boolean, $operatorDone: Boolean) {
    projects(leadEngineerDone: $leadEngineerDone, operatorDone: $operatorDone) {
      leadEngineerDone
      data
      id
      descriptions {
        data
        items {
          stage
          id
          operatorDone
          qualityControlDone
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
            cumulativeThicknes {
              id
              data
            }
          }
        }
      }
      operators {
        id
        data
        measurementPointActualTvds {
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
        measurementPointQcs {
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

const query = {
  ALL,
  GET_ORDER_GEOMETRY,
  GET_LEAD_ENGINEER,
  GET_GEOMETRY,
  GET_ORDER,
  GET_OPERATOR_BY_DESCRIPTION,
  GET_OPERATOR_BY_ITEM,
  OPERATOR_PROJECTS,
  QUALITY_CONTROL
};
export default query;
