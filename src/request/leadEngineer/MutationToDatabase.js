import gql from "graphql-tag";

const ORDER = gql`
  mutation projects(
    $projects: [ProjectInupt]
    $descriptions: [DescriptionsInupt]
    $items: [ItemInput]
    $uploadFile: [UploadFileInupt]
  ) {
    projects(
      projects: $projects
      descriptions: $descriptions
      items: $items
      uploadFile: $uploadFile
    ) {
      new {
        id
        data
        descriptions {
          id
          data
          uploadFile {
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
    items(id: $id, foreignKey: $foreignKey, data: $data, different: $different) {
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
  mutation itemsDelete($id: Int) {
    itemsDelete(id: $id) {
      deletet
    }
  }
`;

const LEADENGINEER = gql`
  mutation leadEngineers(
    $leadEngineers: [UnderCategoriesOfLeadEngineerInupt]
    $measurementPointOperatorsActualTvds: [UnderCategoriesOfLeadEngineerInupt]
    $customSteelPreparations: [UnderCategoriesOfLeadEngineerInupt]
    $rubberCements: [UnderCategoriesOfLeadEngineerInupt]
    $vulcanizationOperatorsSteps: [UnderCategoriesOfLeadEngineerInupt]
    $coatingLayers: [UnderCategoriesOfLeadEngineerInupt]
    $customFinalInspections: [UnderCategoriesOfLeadEngineerInupt]
    $descriptionsId: Int
    $itemsId: Int
  ) {
    leadEngineers(
      leadEngineers: $leadEngineers
      measurementPointOperatorsActualTvds: $measurementPointOperatorsActualTvds
      customSteelPreparations: $customSteelPreparations
      rubberCements: $rubberCements
      vulcanizationOperatorsSteps: $vulcanizationOperatorsSteps
      coatingLayers: $coatingLayers
      customFinalInspections: $customFinalInspections
      descriptionsId: $descriptionsId
      itemsId: $itemsId
    ) {
      new {
        id
        data
        measurementPointOperatorsActualTvds {
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
        vulcanizationOperatorsSteps {
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
  mutation leadEngineers(
    $operators: [UnderCategoriesOfLeadEngineerInupt]
    $customMediaBlastings: [UnderCategoriesOfLeadEngineerInupt]
    $coating: [UnderCategoriesOfLeadEngineerInupt]
    $mixDates: [UnderCategoriesOfLeadEngineerInupt]
    $measurementPointOperators: [UnderCategoriesOfLeadEngineerInupt]
    $vulcanizationOperators: [UnderCategoriesOfLeadEngineerInupt]
    $itemsIdList: [ListId]
  ) {
    leadEngineers(
      operators: $leadEngineers
      customMediaBlastings: $measurementPointOperatorsActualTvds
      coating: $customSteelPreparations
      mixDates: $rubberCements
      measurementPointOperators: $vulcanizationOperatorsSteps
      vulcanizationOperators: $coatingLayers
      itemsIdList: $itemsIdList
    ) {
      new {
        id
        data
        customMediaBlastings {
          id
          data
        }
        coating {
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

const mutations = {
  ORDER,
  DELETEITEM,
  ITEM,
  LEADENGINEER,
  OPERATOR
};
export default mutations;
