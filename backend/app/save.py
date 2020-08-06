import json
import ast
from copy import deepcopy
from graphql import GraphQLError

from .models import (
    Project, Description, Item, UploadFile,
    LeadEngineer, CumulativeThickness,
    VulcanizationStep, CoatingLayer, Operator,
    CoatingOperator, MixDate, VulcanizationOperator,
    FinalInspectionQualityControl, MeasurementPointOperator,
    MeasurementPointQualityControl, RubberCement, UserProfile,
    MeasurementPointActualTVD, PeelTestQualityControl,
    HardnessQualityControl, FinalInspectionCustomTest,
    AdditionalCustomTest, FinalInspectionDimensionsCheck,
    FinalInspectionDimensionsCheckQualityControl,
    AdditionalCustomTestOperator, Layer,
    FinalInspectionCustomTestQualityControl,
    RubberCementOperator
)


def get_values(input, keys):
    return {key: value for key, value in input.items() if key in keys}


def merge_data(old_data, new_data):
    old_data = old_data.get().data
    if old_data and 0 < len(old_data):
        old_data = json.loads(old_data)
    else:
        old_data = {}
    if new_data and 0 < len(new_data):
        new_data = json.loads(new_data)
        if new_data is None:
            new_data = {}
    else:
        new_data = {}
    data = json.dumps({**old_data, **new_data})
    return data


def get_file_input(input, keys):
    file_input = {}

    for key, value in input.items():
        if key in keys and not isinstance(value, (dict, str)):
            file_input[key] = value
    return file_input


def get_variables(dictionary):
    data = dictionary.get("data", "")
    id = dictionary.get("id", None)
    foreignKey = dictionary.get("foreignKey", None)
    return data, id, foreignKey


def project(input):
    keys = ["lead_engineer_done",
            "operator_done",
            "quality_control_done",
            "operator_started"]
    project_input = get_values(input, keys)
    data, id, _ = get_variables(input)
    if id:
        project = Project.objects.filter(pk=id).order_by('id')
        old_project = project.get().data
        if 2 < len(old_project) and 2 < len(data):
            old_number_of_descriptions = json.loads(
                old_project)['numberOfDescriptions']
            new_number_of_descriptions = json.loads(
                data)['numberOfDescriptions']
            if int(new_number_of_descriptions) < int(old_number_of_descriptions):
                descriptions = Description.objects.filter(
                    project__id=id).order_by('id').order_by('id')
                for i in range(int(old_number_of_descriptions)-1, int(new_number_of_descriptions)-1, -1):
                    try:
                        descriptions[i].delete()
                    except:
                        pass
        data = merge_data(project, data)
        project.update(data=data, **project_input)
        return project.get()
    else:
        project = Project(data=data, **project_input)
        project.save()
        return project


def description(input):
    data, id, foreignKey = get_variables(input)
    if id:
        description = Description.objects.filter(pk=id).order_by('id')
        data = merge_data(description, data)
        description.update(data=data)
        return description.get()
    else:
        project = Project.objects.get(pk=foreignKey)
        description = Description(data=data, project=project)
        description.save()
        return description


def upload_file(input, foreignkeyModel, model_string, foreignKey=None):
    if "id" in input:
        upload_file = UploadFile.objects.filter(id=input['id'])
        if isinstance(input["file"], (dict, str)):
            input.pop("file")
        upload_file.update(**input)
        upload_file = upload_file.get()
    else:
        foreignkey_model = foreignkeyModel.objects.get(id=foreignKey.id)
        print(input)
        upload_file = UploadFile(**{model_string: foreignkey_model}, **input)
        upload_file.save()
    return upload_file


def item(input):
    keys = ["stage",
            "qr_code",
            "unique",
            "repair",
            "seen",
            "itemId"]

    item_input = get_values(input, keys)
    if "id" in input:
        item = Item.objects.filter(pk=input['id']).order_by('id')
        item.update(**item_input)
        return item.get()
    else:
        description = Description.objects.get(id=input['foreign_key'])
        item = Item(description=description, **item_input)
        item.save()
        items = Item.objects.filter(
            description=description, unique=False).order_by('id')

        try:
            lead_engineer_first_item = LeadEngineer.objects.get(item=items[0])
        except:
            lead_engineer_first_item = False
        if lead_engineer_first_item and 0 < len(lead_engineer_first_item.data):
            lead_engineer_copy = deepcopy(lead_engineer_first_item)
            lead_engineer_copy.id = None
            lead_engineer_copy.item = item
            lead_engineer_copy.save()
            for measurement_point_actual_tdv in MeasurementPointActualTVD.objects.filter(lead_engineer=lead_engineer_first_item).order_by('id'):
                measurement_point_actual_tdv_copy = deepcopy(
                    measurement_point_actual_tdv)
                measurement_point_actual_tdv_copy.id = None
                measurement_point_actual_tdv_copy.lead_engineer = lead_engineer_copy
                measurement_point_actual_tdv_copy.save()
            for final_inspection_custom_test in FinalInspectionCustomTest.objects.filter(lead_engineer=lead_engineer_first_item).order_by('id'):
                final_inspection_custom_test_copy = deepcopy(
                    final_inspection_custom_test)
                final_inspection_custom_test_copy.id = None
                final_inspection_custom_test_copy.lead_engineer = lead_engineer_copy
                final_inspection_custom_test_copy.save()
            for additional_custom_test in AdditionalCustomTest.objects.filter(lead_engineer=lead_engineer_first_item).order_by('id'):
                additional_custom_test_copy = deepcopy(
                    additional_custom_test)
                additional_custom_test_copy.id = None
                additional_custom_test_copy.lead_engineer = lead_engineer_copy
                additional_custom_test_copy.save()
            for final_inspection_dimensions_check in FinalInspectionDimensionsCheck.objects.filter(lead_engineer=lead_engineer_first_item).order_by('id'):
                final_inspection_dimensions_check_copy = deepcopy(
                    final_inspection_dimensions_check)
                final_inspection_dimensions_check_copy.id = None
                final_inspection_dimensions_check_copy.lead_engineer = lead_engineer_copy
                final_inspection_dimensions_check_copy.save()
            for rubber_cement in RubberCement.objects.filter(lead_engineer=lead_engineer_first_item).order_by('id'):
                rubber_cement_copy = deepcopy(rubber_cement)
                rubber_cement_copy.id = None
                rubber_cement_copy.lead_engineer = lead_engineer_copy
                rubber_cement_copy.save()
            for vulcanization_step in VulcanizationStep.objects.filter(lead_engineer=lead_engineer_first_item).order_by('id'):
                vulcanization_step_copy = deepcopy(vulcanization_step)
                vulcanization_step_copy.id = None
                vulcanization_step_copy.lead_engineer = lead_engineer_copy
                vulcanization_step_copy.save()
                for coating_layer in CoatingLayer.objects.filter(vulcanization_step=vulcanization_step).order_by('id'):
                    coating_layer_copy = deepcopy(coating_layer)
                    coating_layer_copy.id = None
                    coating_layer_copy.vulcanization_step = vulcanization_step_copy
                    coating_layer_copy.save()
                    for cumulative_thickness in CumulativeThickness.objects.filter(coating_layer=coating_layer).order_by('id'):
                        cumulative_thickness_copy = deepcopy(
                            cumulative_thickness)
                        cumulative_thickness_copy.id = None
                        cumulative_thickness_copy.coating_layer = coating_layer_copy
                        cumulative_thickness_copy.save()
        return item


def lead_engineer(input):
    data, id, foreignKey = get_variables(input)
    item = Item.objects.get(id=foreignKey)
    if id:
        lead_engineer = LeadEngineer.objects.filter(item=item).order_by('id')
        data = merge_data(lead_engineer, data)
        lead_engineer.update(data=data)
        return lead_engineer.get()
    else:
        lead_engineer = LeadEngineer(data=data, item=item)
        lead_engineer.save()
        return lead_engineer


def save_method_lead_engineer(input, step, model_string, Model, foreignKey):
    data, id, _ = get_variables(input)
    if id and step <= Model.objects.filter(**{model_string: foreignKey}).order_by('id').count() - 1:
        model = Model.objects.filter(
            **{model_string: foreignKey}).order_by('id')[step]
        model = Model.objects.filter(id=model.id)
        data = merge_data(model, data)
        model.update(data=data)
        return model.get()
    else:
        model = Model(**{"data": data, model_string: foreignKey})
        model.save()
        return model


def measurement_point_actual_tvd(input, step, foreignKey):
    return save_method_lead_engineer(input, step, "lead_engineer", MeasurementPointActualTVD, foreignKey)


def final_inspection_custom_test(input, step, foreignKey):
    return save_method_lead_engineer(input, step, "lead_engineer", FinalInspectionCustomTest, foreignKey)


def additional_custom_test(input, step, foreignKey):
    return save_method_lead_engineer(input, step, "lead_engineer", AdditionalCustomTest, foreignKey)


def rubber_cement(input, step, foreignKey):
    return save_method_lead_engineer(input, step, "lead_engineer", RubberCement, foreignKey)


def vulcanization_step(input, step, foreignKey):
    return save_method_lead_engineer(input, step, "lead_engineer", VulcanizationStep, foreignKey)


def coating_layer(input, step, foreignKey):
    return save_method_lead_engineer(input, step, "vulcanization_step", CoatingLayer, foreignKey)


def cumulative_thickness(input, step, foreignKey):
    return save_method_lead_engineer(input, step, "coating_layer", CumulativeThickness, foreignKey)


def final_inspection_dimensions_check(input, step, foreignKey):
    return save_method_lead_engineer(input, step, "lead_engineer", FinalInspectionDimensionsCheck, foreignKey)


def save_method_operator(input, step, foreignkeyModel, model_string, Model, foreignKey):
    data, id, _ = get_variables(input)

    if id:
        model = Model.objects.filter(
            **{model_string: foreignKey}).order_by('id')[step]
        model = Model.objects.filter(id=model.id)
        data = merge_data(model, data)
        model = model.first()
        model.data = data
        if "surface_cleanliness_image" in input:
            model.surface_cleanliness_image = input["surface_cleanliness_image"]
        model.save()
        return model
    elif foreignKey:
        foreignkey_model = foreignkeyModel.objects.get(id=foreignKey.id)
        surface_cleanliness_image = {}
        if "surface_cleanliness_image" in input:
            surface_cleanliness_image = {
                "surface_cleanliness_image": input["surface_cleanliness_image"]}
        model = Model(
            **{"data": data, model_string: foreignkey_model, **surface_cleanliness_image})
        model.save()
        return model
    raise GraphQLError("Custom Error: 2121212121212121212212121221")


def get_correct_id_list(item_id_list):
    if item_id_list:
        return [{"id": Operator.objects.get(item=item["id"])} for item in item_id_list]
    else:
        return []


def operator(input, step, foreignKey):
    return save_method_operator(input, step, Item, "item", Operator, foreignKey)


def vulcanization_operator(input, step, foreignKey):
    return save_method_operator(input, step, Operator, "operator", VulcanizationOperator, foreignKey)


def additional_custom_test_operator(input, step, foreignKey):
    return save_method_operator(input, step, Operator, "operator", AdditionalCustomTestOperator, foreignKey)


def coating_operator(input, step, foreignKey):
    return save_method_operator(input, step, VulcanizationOperator, "vulcanization_operator", CoatingOperator, foreignKey)


def measurement_point_operator(input, step, foreignKey, model_string=CoatingOperator, Model="coating_operator"):
    return save_method_operator(input, step, model_string, Model, MeasurementPointOperator, foreignKey)


def rubber_cement_operator(input, step, foreignKey):
    return save_method_operator(input, step, Operator, "operator", RubberCementOperator, foreignKey)


def mix_date(input, step, foreignKey):
    return save_method_operator(input, step, RubberCementOperator, "rubber_cement_operator", MixDate, foreignKey)


def layer(input, step, foreignKey):
    return save_method_operator(input, step, CoatingOperator, "coating_operator", Layer, foreignKey)


def new_foreign_key_to_measurement_point_actual_tvd(item, query_operator):
    measurement_point_actual_tvd_le = MeasurementPointActualTVD.objects.filter(
        lead_engineer__item__in=item)
    measurement_point_actual_tvd_o = MeasurementPointActualTVD.objects.filter(
        operator__item__in=item)
    difference = measurement_point_actual_tvd_le.count(
    ) - measurement_point_actual_tvd_o.count()
    if 0 < difference:
        for i in range(measurement_point_actual_tvd_o.count(), measurement_point_actual_tvd_le.count()):
            MeasurementPointActualTVD.objects.filter(
                id=measurement_point_actual_tvd_le[i].id).update(operator=query_operator)
    elif difference < 0:
        raise GraphQLError("Custom Error: 6786737345r63874563")


def update_measurement_point_actual_tvd(input, step, foreignKey, item):
    new_data, _, _ = get_variables(input)
    model = MeasurementPointActualTVD.objects.filter(
        operator=foreignKey).order_by('id')[step]
    model = MeasurementPointActualTVD.objects.filter(id=model.id)
    old_data = model.get().data
    if 0 < len(old_data):
        old_data = json.loads(old_data)
    if 0 < len(new_data):
        new_data = json.loads(new_data)
    data = json.dumps({**old_data, **new_data})
    model.update(data=data)
    return model.get()


def final_inspection_quality_control(input, step, foreignKey):
    return save_method_operator(input, step, Item, "item", FinalInspectionQualityControl, foreignKey)


def measurement_point_quality_control(input, step, foreignKey):
    return save_method_operator(input, step, FinalInspectionQualityControl, "final_inspection_quality_control", MeasurementPointQualityControl, foreignKey)


def hardness_quality_control(input, step, foreignKey):
    return save_method_operator(input, step, FinalInspectionQualityControl, "final_inspection_quality_control", HardnessQualityControl, foreignKey)


def peel_test_quality_control(input, step, foreignKey):
    return save_method_operator(input, step, FinalInspectionQualityControl, "final_inspection_quality_control", PeelTestQualityControl, foreignKey)


def final_inspection_custom_test_quality_control(input, step, foreignKey):
    return save_method_operator(input, step, FinalInspectionQualityControl, "final_inspection_quality_control", FinalInspectionCustomTestQualityControl, foreignKey)


def final_inspection_dimensions_check_quality_control(input, step, foreignKey):
    return save_method_operator(input, step, FinalInspectionQualityControl, "final_inspection_quality_control", FinalInspectionDimensionsCheckQualityControl, foreignKey)
