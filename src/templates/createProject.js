export default {
  getOldValue: "projects",
  getNewValue: "projects.new",
  mutation: "ORDER",
  query: "GET_ORDER_GEOMETRY",
  optionsQuery: "USERS",
  chapters: [
    {
      stageQueryPath: "projects.0.data.stageCoating",
      pages: [
        {
          pageTitle: "Project",
          queryPath: "projects.0",
          fields: [
            {
              fieldName: "projectNumber",
              required: true,
              label: "Project Number/PO number"
            },
            {
              fieldName: "projectName",
              label: "Project Name"
            },
            {
              fieldName: "client",
              required: true,
              label: "Client"
            },
            {
              fieldName: "projectManager",
              label: "Project Manager",
              type: "select",
              options: [
                "Finn Gustavsen",
                "Kristin Grimnes",
                "Jan Lilleland",
                "Kolbjørn Walderhaug",
                "Kjetil Smedberg",
                "Tom Alexander Hansen",
                "Kristoffer Mikaelsen",
                "Eva Eline Bækken"
              ]
            },
            {
              fieldName: "projectLead",
              label: "Project Lead",
              type: "select",
              required: true,
              userRole: ["lead"]
            },
            {
              fieldName: "supervisingEngineer",
              label: "Supervising Engineer",
              type: "select",
              required: true,
              userRole: ["lead"]
            },
            {
              fieldName: "supervisor",
              label: "Supervisor",
              type: "select",
              userRole: ["supervisor"]
            },
            {
              fieldName: "qualityControl",
              label: "Quality Control",
              type: "select",
              required: true,
              userRole: ["quality"]
            },
            {
              fieldName: "numberOfDescriptions",
              label: "Number of Descriptions",
              type: "Number",
              required: true,
              min: 1
            },
            {
              fieldName: "totalNumberOfItems",
              label: "Total Number of Items",
              type: "Number",
              required: true,
              min: 1
            }
          ]
        }
      ]
    },
    {
      stageQueryPath: ["projects.0.descriptions", "data.stageCoating"],
      pages: [
        {
          pageTitle: "Description",
          queryPath: ["projects.0.descriptions", ""],
          fields: [
            {
              fieldName: "geometry",
              label: "Geometry",
              type: "select",
              options: [
                "Mould",
                "Coated Item",
                "Slip on 2",
                "Slip on 3",
                "B2P",
                "Dual"
              ],
              required: true,
              notCustom: true
            },
            {
              fieldName: "descriptionNameMaterialNo",
              label: "Description name(Coating)/Material number(Packer)",
              required: true
            }
          ]
        },
        {
          repeatStartWith: 1,
          delete: true,
          addButton: "Additional information",
          queryPath: ["projects.0.descriptions", "specifications"],
          fields: [
            {
              fieldName: "specificationTitle",
              label: "Additional information",
              type: "select",
              options: [
                "Report Code - Hours",
                "Report Code - Materials",
                "Shop Order no."
              ]
            },
            {
              noComment: true,
              fieldName: "specificationValue",
              prepend: "value"
            }
          ]
        },
        {
          label: "File Upload",
          type: "files",
          queryPath: ["projects.0.descriptions", "uploadFiles"],
          description: true
        }
      ]
    }
  ]
};
