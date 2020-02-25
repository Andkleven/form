import gql from "graphql-tag";

const ORDER = gql`
  mutation createProject(
    $createProject: [CreateProjectInupt]
    $category: [CategoryInupt]
    $item: [ItemInput]
    $uploadFile: [UploadFileInupt]
  ) {
    createProject(
      createProject: $createProject
      category: $category
      item: $item
      uploadFile: $uploadFile
    ) {
      new {
        id
        data
        category {
          id
          data
          uploadFile {
            id
            data
            file
          }
          item {
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
  mutation item(
    $id: Int
    $foreignKey: Int
    $data: String
    $different: Boolean
  ) {
    item(id: $id, foreignKey: $foreignKey, data: $data, different: $different) {
      new {
        id
        data
        different
        leadEngineer {
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
  mutation leadEngineer(
    $leadEngineer: [UnderCategoriesOfLeadEngineerInupt]
    $measurementPointActualTvd: [UnderCategoriesOfLeadEngineerInupt]
    $customSteelPreparation: [UnderCategoriesOfLeadEngineerInupt]
    $rubberCement: [UnderCategoriesOfLeadEngineerInupt]
    $vulcanizationStep: [UnderCategoriesOfLeadEngineerInupt]
    $coatingLayer: [UnderCategoriesOfLeadEngineerInupt]
    $customFinalInspection: [UnderCategoriesOfLeadEngineerInupt]
    $categoryId: Int
    $itemId: Int
  ) {
    leadEngineer(
      leadEngineer: $leadEngineer
      measurementPointActualTvd: $measurementPointActualTvd
      customSteelPreparation: $customSteelPreparation
      rubberCement: $rubberCement
      vulcanizationStep: $vulcanizationStep
      coatingLayer: $coatingLayer
      customFinalInspection: $customFinalInspection
      categoryId: $categoryId
      itemId: $itemId
    ) {
      new {
        id
        data
        measurementPointActualTvd {
          id
          data
        }
        customSteelPreparation {
          id
          data
        }
        rubberCement {
          id
          data
        }
        vulcanizationStep {
          id
          data
        }
        coatingLayer {
          id
          data
        }
        customFinalInspection {
          id
          data
        }
      }
    }
  }
`;

const OPERATOR = gql`
  mutation leadEngineer(
    $operator: [UnderCategoriesOfLeadEngineerInupt]
    $customMediaBlasting: [UnderCategoriesOfLeadEngineerInupt]
    $coating: [UnderCategoriesOfLeadEngineerInupt]
    $mixDate: [UnderCategoriesOfLeadEngineerInupt]
    $measurementPoint: [UnderCategoriesOfLeadEngineerInupt]
    $vulcanization: [UnderCategoriesOfLeadEngineerInupt]
    $itemIdList: [ListId]
  ) {
    leadEngineer(
      operator: $leadEngineer
      customMediaBlasting: $measurementPointActualTvd
      coating: $customSteelPreparation
      mixDate: $rubberCement
      measurementPoint: $vulcanizationStep
      vulcanization: $coatingLayer
      itemIdList: $itemIdList
    ) {
      new {
        id
        data
        customMediaBlasting {
          id
          data
        }
        coating {
          id
          data
          mixDate {
            id
            data
          }
          measurementPoint {
            id
            data
          }
        }
        vulcanization {
          id
          data
        }
      }
    }
  }
`;

const mutations = {
  ORDER,
  DELETEITEM,
  ITEM,
  LEADENGINEER,
  OPERATOR
};
export default mutations;
