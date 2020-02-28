import gql from "graphql-tag";

const ORDER = gql`
  mutation projects(
    $project: [ProjectInupt]
    $description: [DescriptionInupt]
    $item: [ItemInput]
    $uploadFile: [UploadFileInupt]
  ) {
    projects(
      project: $project
      description: $description
      item: $item
      uploadFile: $uploadFile
    ) {
      new {
        id
        data
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
const ITEM = gql`
  mutation items(
    $id: Int
    $foreignKey: Int
    $data: String
    $different: Boolean
  ) {
    items(
      id: $id
      foreignKey: $foreignKey
      data: $data
      different: $different
    ) {
      new {
        id
        data
        different
        leadEngineers {
          id
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

const LEADENGINEER = gql`
  mutation leadEngineers(
    $leadEngineer: [UnderCategoriesOfLeadEngineerInupt]
    $measurementPointActualTvd: [UnderCategoriesOfLeadEngineerInupt]
    $customSteelPreparation: [UnderCategoriesOfLeadEngineerInupt]
    $rubberCement: [UnderCategoriesOfLeadEngineerInupt]
    $vulcanizationStep: [UnderCategoriesOfLeadEngineerInupt]
    $coatingLayer: [UnderCategoriesOfLeadEngineerInupt]
    $customFinalInspection: [UnderCategoriesOfLeadEngineerInupt]
    $descriptionId: Int
    $itemId: Int
  ) {
    leadEngineers(
      leadEngineer: $leadEngineer
      measurementPointActualTvd: $measurementPointActualTvd
      customSteelPreparation: $customSteelPreparation
      rubberCement: $rubberCement
      vulcanizationStep: $vulcanizationStep
      coatingLayer: $coatingLayer
      customFinalInspection: $customFinalInspection
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
        customSteelPreparations {
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
        }
        coatingLayers {
          id
          data
        }
        customFinalInspections {
          id
          data
        }
      }
    }
  }
`;

const OPERATOR = gql`
  mutation operators(
    $operator: [UnderCategoriesOfLeadEngineerInupt]
    $customMediaBlasting: [UnderCategoriesOfLeadEngineerInupt]
    $coatingOperator: [UnderCategoriesOfLeadEngineerInupt]
    $mixDate: [UnderCategoriesOfLeadEngineerInupt]
    $measurementPointOperator: [UnderCategoriesOfLeadEngineerInupt]
    $vulcanizationOperator: [UnderCategoriesOfLeadEngineerInupt]
    $itemsIdList: [ListId]
  ) {
    operators(
      operator: $operator
      customMediaBlasting: $customMediaBlasting
      coatingOperator: $coatingOperator
      mixDate: $mixDate
      measurementPointOperator: $measurementPointOperator
      vulcanizationOperator: $vulcanizationOperator
      itemsIdList: $itemsIdList
    ) {
      new {
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
  ITEM,
  LEADENGINEER,
  OPERATOR,
  LEADENGINEERDONE
};
export default mutations;
