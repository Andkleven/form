import gql from "graphql-tag";

const ORDER = gql`
  mutation projects($projects: [ProjectInupt]) {
    projects(projects: $projects) {
      new {
        id
        data
        leadEngineerDone
        descriptions {
          id
          data
          uploadFiles {
            id
            data
            file
          }
          items {
            id
            data
            different
            qrCode
            repair
            operatorDone
            qualityControlDone
          }
        }
      }
    }
  }
`;

const DELETEITEM = gql`
  mutation itemDelete($id: Int) {
    itemDelete(id: $id) {
      deletet
    }
  }
`;

const UPDATEITEM = gql`
  mutation updateItem(
    $id: Int!
    $data: String
    $different: Boolean
    $qrCode: String
    $repair: Boolean
    $operatorDone: Boolean
    $qualityControlDone: Boolean
    $stage: String
  ) {
    updateItem(
      id: $id
      data: $data
      different: $different
      qrCode: $qrCode
      repair: $repair
      operatorDone: $operatorDone
      qualityControlDone: $qualityControlDone
      stage: $stage
    ) {
      new {
        id
        data
        different
        qrCode
        repair
        operatorDone
        qualityControlDone
      }
    }
  }
`;

const LEADENGINEER = gql`
  mutation leadEngineers(
    $leadEngineers: [LeadEngineerInupt]
    $descriptionId: Int
    $itemId: Int
  ) {
    leadEngineers(
      leadEngineers: $leadEngineers
      descriptionId: $descriptionId
      itemId: $itemId
    ) {
      new {
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
`;

const OPERATORBATCHING = gql`
  mutation operatorsBaching(
    $operators: [UnderCategoriesOfLeadEngineerInupt]
    $vulcanizationOperators: [UnderCategoriesOfLeadEngineerInupt]
    $itemIdList: [Int]!
    $stage: String
  ) {
    operatorsBaching(
      operators: $operators
      vulcanizationOperators: $vulcanizationOperators
      itemIdList: $itemIdList
      stage: $stage
    ) {
      batching {
        id
        data
        items {
          id
          data
          stage
          operators {
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
            vulcanizationOperators {
              id
              data
            }
          }
        }
      }
    }
  }
`;

const OPERATOR = gql`
  mutation operators(
    $operator: [UnderCategoriesOfLeadEngineerInupt]
    $coatingOperator: [UnderCategoriesOfLeadEngineerInupt]
    $mixDate: [UnderCategoriesOfLeadEngineerInupt]
    $measurementPointOperator: [UnderCategoriesOfLeadEngineerInupt]
    $vulcanizationOperator: [UnderCategoriesOfLeadEngineerInupt]
    $itemIdList: [Int]
    $stage: String
  ) {
    operators(
      operator: $operator
      coatingOperator: $coatingOperator
      mixDate: $mixDate
      measurementPointOperator: $measurementPointOperator
      vulcanizationOperator: $vulcanizationOperator
      itemIdList: $itemIdList
      stage: $stage
    ) {
      new {
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
        vulcanizationOperators {
          id
          data
        }
      }
    }
  }
`;

const LEADENGINEERDONE = gql`
  mutation projects($project: [ProjectInupt]) {
    projects(project: $project) {
      new {
        leadEngineerDone
      }
    }
  }
`;

const mutations = {
  ORDER,
  DELETEITEM,
  UPDATEITEM,
  LEADENGINEER,
  OPERATORBATCHING,
  OPERATOR,
  LEADENGINEERDONE
};
export default mutations;
