import graphene
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphene import InputObjectType
from graphql import GraphQLError
from graphene_file_upload.scalars import Upload
import django_filters
from django.contrib.auth.models import User
from copy import deepcopy
import json
import ast
from . import save
from .models import (
    Project, Description, Item, UploadFile,
    LeadEngineer, CumulativeThickness,
    VulcanizationStep, CoatingLayer, Operator,
    CoatingOperator, MixDate, VulcanizationOperator,
    FinalInspectionQualityControl, MeasurementPointOperator,
    MeasurementPointQualityControl, RubberCement, UserProfile,
    MeasurementPointActualTVD, PeelTestQualityControl,
    HardnessQualityControl, Seen, FinalInspectionCustomTest,
    AdditionalCustomTest, AdditionalCustomTestOperator,
    FinalInspectionCustomTestQualityControl,
    FinalInspectionDimensionsCheckQualityControl,
    FinalInspectionDimensionsCheck, Layer, RubberCementOperator
)


class ProjectFilter(django_filters.FilterSet):
    class Meta:
        model = Project
        fields = ('__all__')


class ProjectNode(DjangoObjectType):
    class Meta:
        model = Project
        fields = ('__all__')


class DescriptionNode(DjangoObjectType):
    class Meta:
        model = Description
        fields = ('__all__')


class ItemNode(DjangoObjectType):
    class Meta:
        model = Item
        fields = ('__all__')


class SeenNode(DjangoObjectType):
    class Meta:
        model = Seen
        fields = ('__all__')


class UploadFileNode(DjangoObjectType):
    class Meta:
        model = UploadFile
        fields = ('__all__')


class LeadEngineerNode(DjangoObjectType):
    class Meta:
        model = LeadEngineer
        fields = ('__all__')


class FinalInspectionCustomTestNode(DjangoObjectType):
    class Meta:
        model = FinalInspectionCustomTest
        fields = ('__all__')


class AdditionalCustomTestNode(DjangoObjectType):
    class Meta:
        model = AdditionalCustomTest
        fields = ('__all__')


class MeasurementPointActualTVDNode(DjangoObjectType):
    class Meta:
        model = MeasurementPointActualTVD
        fields = ('__all__')


class VulcanizationStepNode(DjangoObjectType):
    class Meta:
        model = VulcanizationStep
        fields = ('__all__')


class CoatingLayerNode(DjangoObjectType):
    class Meta:
        model = CoatingLayer
        fields = ('__all__')


class CumulativeThicknessNode(DjangoObjectType):
    class Meta:
        model = CumulativeThickness
        fields = ('__all__')


class FinalInspectionDimensionsCheckNode(DjangoObjectType):
    class Meta:
        model = FinalInspectionDimensionsCheck
        fields = ('__all__')


class OperatorNode(DjangoObjectType):
    class Meta:
        model = Operator
        fields = ('__all__')


class CoatingNode(DjangoObjectType):
    class Meta:
        model = CoatingOperator
        fields = ('__all__')


class RubberCementOperatorNode(DjangoObjectType):
    class Meta:
        model = RubberCementOperator
        fields = ('__all__')


class MixDateNode(DjangoObjectType):
    class Meta:
        model = MixDate
        fields = ('__all__')


class LayerNode(DjangoObjectType):
    class Meta:
        model = Layer
        fields = ('__all__')


class VulcanizationNode(DjangoObjectType):
    class Meta:
        model = VulcanizationOperator
        fields = ('__all__')


class AdditionalCustomTestOperatorNode(DjangoObjectType):
    class Meta:
        model = AdditionalCustomTestOperator
        fields = ('__all__')


class FinalInspectionQualityControlNode(DjangoObjectType):
    class Meta:
        model = FinalInspectionQualityControl
        fields = ('__all__')


class MeasurementPointOperatorNode(DjangoObjectType):
    class Meta:
        model = MeasurementPointOperator
        fields = ('__all__')


class MeasurementPointQualityControlNode(DjangoObjectType):
    class Meta:
        model = MeasurementPointQualityControl
        fields = ('__all__')


class HardnessQualityControlNode(DjangoObjectType):
    class Meta:
        model = HardnessQualityControl
        fields = ('__all__')


class PeelTestQualityControlNode(DjangoObjectType):
    class Meta:
        model = PeelTestQualityControl
        fields = ('__all__')


class FinalInspectionCustomTestQualityControlNode(DjangoObjectType):
    class Meta:
        model = FinalInspectionCustomTestQualityControl
        fields = ('__all__')


class FinalInspectionDimensionsCheckQualityControlNode(DjangoObjectType):
    class Meta:
        model = FinalInspectionDimensionsCheckQualityControl
        fields = ('__all__')


class RubberCementNode(DjangoObjectType):
    class Meta:
        model = RubberCement
        fields = ('__all__')


class UserProfileNode(DjangoObjectType):
    class Meta:
        model = UserProfile
        fields = ('__all__')


def login(info):
    user = info.context.user
    if user.is_anonymous:
        raise GraphQLError('You must be logged!')


class Query(graphene.ObjectType):
    user_profile = graphene.List(UserProfileNode,
                                 user=graphene.String(),
                                 role=graphene.List(graphene.String))
    projects = graphene.List(ProjectNode,
                             id=graphene.Int(),
                             lead_engineer_done=graphene.Boolean()
                             )
    descriptions = graphene.List(DescriptionNode,
                                 id=graphene.Int(),
                                 project=graphene.Int()
                                 )
    items = graphene.List(ItemNode,
                          id=graphene.Int(),
                          repair=graphene.Boolean(),
                          description=graphene.Int()
                          )
    seen = graphene.List(SeenNode,
                         id=graphene.Int(),
                         item=graphene.Int()
                         )
    upload_files = graphene.List(UploadFileNode,
                                 id=graphene.Int(),
                                 description=graphene.Int(),
                                 operator=graphene.Int(),
                                 final_inspection_quality_control=graphene.Int()
                                 )
    lead_engineers = graphene.List(LeadEngineerNode,
                                   id=graphene.Int(),
                                   item=graphene.Int()
                                   )
    final_inspection_custom_tests = graphene.List(FinalInspectionCustomTestNode,
                                                  id=graphene.Int(),
                                                  lead_engineer=graphene.Int(),
                                                  operators=graphene.Int()
                                                  )
    additional_custom_tests = graphene.List(AdditionalCustomTestNode,
                                            id=graphene.Int(),
                                            lead_engineer=graphene.Int(),
                                            operators=graphene.Int()
                                            )
    measurement_point_actual_tdvs = graphene.List(MeasurementPointActualTVDNode,
                                                  id=graphene.Int(),
                                                  lead_engineer=graphene.Int(),
                                                  operators=graphene.Int()
                                                  )
    rubber_cements = graphene.List(RubberCementNode,
                                   id=graphene.Int(),
                                   lead_engineer=graphene.Int()
                                   )
    vulcanization_steps = graphene.List(VulcanizationStepNode,
                                        id=graphene.Int(),
                                        lead_engineer=graphene.Int()
                                        )
    coating_layers = graphene.List(CoatingLayerNode,
                                   id=graphene.Int(),
                                   vulcanization_step=graphene.Int()
                                   )
    cumulative_thickness = graphene.List(CumulativeThicknessNode,
                                         id=graphene.Int(),
                                         coating_layer=graphene.Int()
                                         )
    final_inspection_dimensions_checks = graphene.List(FinalInspectionDimensionsCheckNode,
                                                       id=graphene.Int(),
                                                       coating_layer=graphene.Int()
                                                       )
    operators = graphene.List(OperatorNode,
                              id=graphene.Int(),
                              item=graphene.Int()
                              )
    vulcanization_operators = graphene.List(VulcanizationNode,
                                            id=graphene.Int(),
                                            operator=graphene.Int()
                                            )
    coating_operators = graphene.List(CoatingNode,
                                      id=graphene.Int(),
                                      vulcanization_operator=graphene.Int()
                                      )
    rubber_cement_operators = graphene.List(RubberCementOperatorNode,
                                            id=graphene.Int(),
                                            operator=graphene.Int()
                                            )
    mix_dates = graphene.List(MixDateNode,
                              id=graphene.Int(),
                              rubber_cement_operator=graphene.Int()
                              )
    layers = graphene.List(LayerNode,
                           id=graphene.Int(),
                           coating_operator=graphene.Int()
                           )
    measurement_point_operators = graphene.List(MeasurementPointOperatorNode,
                                                id=graphene.Int(),
                                                coating_operator=graphene.Int()
                                                )
    additional_custom_test_operators = graphene.List(AdditionalCustomTestOperatorNode,
                                                     id=graphene.Int(),
                                                     coating_operator=graphene.Int()
                                                     )
    final_inspection_quality_controls = graphene.List(FinalInspectionQualityControlNode,
                                                      id=graphene.Int(),
                                                      item=graphene.Int()
                                                      )
    measurement_point_quality_controls = graphene.List(MeasurementPointQualityControlNode,
                                                       id=graphene.Int(),
                                                       final_inspection_quality_control=graphene.Int()
                                                       )
    hardness_quality_controls = graphene.List(MeasurementPointQualityControlNode,
                                              id=graphene.Int(),
                                              final_inspection_quality_control=graphene.Int()
                                              )
    peel_test_quality_controls = graphene.List(MeasurementPointQualityControlNode,
                                               id=graphene.Int(),
                                               final_inspection_quality_control=graphene.Int()
                                               )
    final_inspection_custom_test_quality_controls = graphene.List(FinalInspectionCustomTestQualityControlNode,
                                                                  id=graphene.Int(),
                                                                  final_inspection_quality_control=graphene.Int()
                                                                  )
    final_inspection_dimensions_check_quality_controls = graphene.List(FinalInspectionDimensionsCheckQualityControlNode,
                                                                       id=graphene.Int(),
                                                                       final_inspection_quality_control=graphene.Int()
                                                                       )

    def resolve_user_profile(root, info, user=None, role=[], **input):
        # login(info)
        qc = UserProfile.objects.all()
        if user:
            qc = qc.filter(user=user).order_by('id')
        elif role:
            qc = qc.filter(role__in=set(role)).order_by('id')
        return qc

    def resolve_projects(root, info, id=None, lead_engineer_done=None, **input):
        # login(info)
        qc = Project.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if lead_engineer_done != None:
            qc = qc.filter(
                lead_engineer_done=lead_engineer_done).order_by('id')
        return qc

    def resolve_descriptions(root, info, id=None, project=False, **input):
        # login(info)
        qc = Description.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if project:
            qc = qc.filter(projects=project).order_by('id')
        return qc

    def resolve_items(root, info, id=None, repair=None, description=None, **input):
        # login(info)
        qc = Item.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if repair != None:
            qc = qc.filter(repair=repair).order_by('id')
        if description != None:
            qc = qc.filter(descriptions=description).order_by('id')
        return qc

    def resolve_lead_engineers(root, info, id=None, item=False, **input):
        # login(info)
        qc = Seen.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if item:
            qc = qc.filter(item=item).order_by('id')
        return qc

    def resolve_upload_files(root, info, id=None, description=False, operator=False, final_inspection_quality_control=False, **input):
        # login(info)
        qc = UploadFile.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if description:
            qc = qc.filter(description=description).order_by('id')
        if operator:
            qc = qc.filter(operator=operator).order_by('id')
        if final_inspection_quality_control:
            qc = qc.filter(
                final_inspection_quality_controls=final_inspection_quality_control).order_by('id')
        return qc

    def resolve_lead_engineers(root, info, id=None, item=False, **input):
        # login(info)
        qc = LeadEngineer.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if item:
            qc = qc.filter(item=item).order_by('id')
        return qc

    def resolve_final_inspection_custom_tests(root, info, id=None, lead_engineer=False, operator=False, **input):
        # login(info)
        qc = FinalInspectionCustomTest.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if lead_engineer:
            qc = qc.filter(lead_engineer=lead_engineer).order_by('id')
        if operator:
            qc = qc.filter(operator=operator).order_by('id')
        return qc

    def resolve_additional_custom_tests(root, info, id=None, lead_engineer=False, operator=False, **input):
        # login(info)
        qc = AdditionalCustomTest.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if lead_engineer:
            qc = qc.filter(lead_engineer=lead_engineer).order_by('id')
        if operator:
            qc = qc.filter(operator=operator).order_by('id')
        return qc

    def resolve_measurement_point_actual_tdvs(root, info, id=None, lead_engineer=False, operator=False, **input):
        # login(info)
        qc = MeasurementPointActualTVD.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if lead_engineer:
            qc = qc.filter(lead_engineer=lead_engineer).order_by('id')
        if operator:
            qc = qc.filter(operator=operator).order_by('id')
        return qc

    def resolve_rubber_cements(root, info, id=None, lead_engineer=False, **input):
        # login(info)
        qc = RubberCement.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if lead_engineer:
            qc = qc.filter(lead_engineer=lead_engineer).order_by('id')
        return qc

    def resolve_final_inspection_dimensions_checks(root, info, id=None, lead_engineer=False, **input):
        # login(info)
        qc = FinalInspectionDimensionsCheck.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if lead_engineer:
            qc = qc.filter(lead_engineer=lead_engineer).order_by('id')
        return qc

    def resolve_vulcanization_steps(root, info, id=None, lead_engineer=False, **input):
        # login(info)
        qc = VulcanizationStep.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if lead_engineer:
            qc = qc.filter(lead_engineer=lead_engineer).order_by('id')
        return qc

    def resolve_coating_layers(root, info, id=None, vulcanization_step=False, **input):
        # login(info)
        qc = CoatingLayer.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if vulcanization_step:
            qc = qc.filter(
                vulcanization_steps=vulcanization_step).order_by('id')
        return qc

    def resolve_cumulative_thickness(root, info, id=None, coating_layer=False, **input):
        # login(info)
        qc = CumulativeThickness.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if vulcanization_step:
            qc = qc.filter(coating_layers=coating_layer).order_by('id')
        return qc

    def resolve_operators(root, info, id=None, item=False, **input):
        # login(info)
        qc = Operator.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if item:
            qc = qc.filter(item=item).order_by('id')
        return qc

    def resolve_vulcanization_operators(root, info, id=None, operator=False, **input):
        # login(info)
        qc = Vulcanization.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if operator:
            qc = qc.filter(operators=operator).order_by('id')
        return qc

    def resolve_coating_operators(root, info, id=None, vulcanization_operator=False, **input):
        # login(info)
        qc = Coating.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if vulcanization_operator:
            qc = qc.filter(
                vulcanization_operators=vulcanization_operator).order_by('id')
        return qc

    def resolve_rubber_cement_operators(root, info, id=None, operator=False, **input):
        # login(info)
        qc = RubberCementOperator.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if operator:
            qc = qc.filter(coating_operators=operator).order_by('id')
        return qc

    def resolve_mix_dates(root, info, id=None, rubber_cement_operator=False, **input):
        # login(info)
        qc = MixDate.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if rubber_cement_operator:
            qc = qc.filter(
                rubber_cement_operators=rubber_cement_operator).order_by('id')
        return qc

    def resolve_layers(root, info, id=None, coating_operator=False, **input):
        # login(info)
        qc = Layer.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if coating_operator:
            qc = qc.filter(coating_operators=coating_operator).order_by('id')
        return qc

    def resolve_measurement_point_operators(root, info, id=None, coating_operator=False, vulcanization_operator=False, **input):
        # login(info)
        qc = MeasurementPoint.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if coating_operator:
            return qc.filter(coating_operators=coating_operator).order_by('id')
        if vulcanization_operator:
            return qc.filter(vulcanization_operators=vulcanization_operator).order_by('id')
        return qc

    def resolve_additional_custom_test_operators(root, info, id=None, operator=False, **input):
        # login(info)
        qc = AdditionalCustomTestOperator.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if operator:
            return qc.filter(operator=operator).order_by('id')
        return qc

    def resolve_final_inspection_quality_controls(root, info, id=None, item=False, **input):
        # login(info)
        qc = FinalInspectionQualityControl.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if item:
            qc = qc.filter(item=item).order_by('id')
        return qc

    def resolve_measurement_point_quality_controls(root, info, id=None, final_inspection_quality_control=False, **input):
        # login(info)
        qc = MeasurementPointQualityControl.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if final_inspection_quality_control:
            return qc.filter(final_inspection_quality_controls=final_inspection_quality_control)
        return qc

    def resolve_hardness_quality_controls(root, info, id=None, final_inspection_quality_control=False, **input):
        # login(info)
        qc = HardnessQualityControl.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if final_inspection_quality_control:
            return qc.filter(final_inspection_quality_controls=final_inspection_quality_control)
        return qc

    def resolve_peel_test_quality_controls(root, info, id=None, final_inspection_quality_control=False, **input):
        # login(info)
        qc = PeelTestQualityControl.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if final_inspection_quality_control:
            return qc.filter(final_inspection_quality_controls=final_inspection_quality_control)
        return qc

    def resolve_final_inspection_custom_test_quality_controls(root, info, id=None, final_inspection_quality_control=False, **input):
        # login(info)
        qc = FinalInspectionCustomTestQualityControl.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if final_inspection_quality_control:
            return qc.filter(final_inspection_quality_controls=final_inspection_quality_control)
        return qc

    def resolve_final_inspection_dimensions_check_quality_controls(root, info, id=None, final_inspection_quality_control=False, **input):
        # login(info)
        qc = FinalInspectionDimensionsCheckQualityControl.objects.all()
        if id is not None:
            return qc.filter(id=id).order_by('id')
        if final_inspection_quality_control:
            return qc.filter(final_inspection_quality_controls=final_inspection_quality_control)
        return qc


class UploadFileInput(InputObjectType):
    id = graphene.Int()
    file_description = graphene.String()
    file = Upload(required=False)


class SeenInput(InputObjectType):
    seen = graphene.String()


class UnderCategoriesOfLeadEngineerInput(InputObjectType):
    id = graphene.Int()
    data = graphene.String()


class ItemInput(InputObjectType):
    id = graphene.Int()
    itemId = graphene.String()

    stage = graphene.String()
    qr_code = graphene.String()
    repair = graphene.Boolean()
    unique = graphene.Boolean()

    lead_engineers = graphene.List(UnderCategoriesOfLeadEngineerInput)


class DescriptionInput(InputObjectType):
    id = graphene.Int()
    data = graphene.String()

    upload_files = graphene.List(UploadFileInput)
    items = graphene.List(ItemInput)


class ProjectInput(InputObjectType):
    id = graphene.Int()
    data = graphene.String()
    lead_engineer_done = graphene.Boolean()

    descriptions = graphene.List(DescriptionInput)


class CoatingLayerInput(InputObjectType):
    id = graphene.Int()
    data = graphene.String()

    cumulative_thickness = graphene.List(UnderCategoriesOfLeadEngineerInput)


class VulcanizationStepInput(InputObjectType):
    id = graphene.Int()
    data = graphene.String()

    coating_layers = graphene.List(CoatingLayerInput)


class LeadEngineerInput(InputObjectType):
    id = graphene.Int()
    data = graphene.String()

    UploadFileInput

    final_inspection_custom_tests = graphene.List(
        UnderCategoriesOfLeadEngineerInput)
    additional_custom_tests = graphene.List(UnderCategoriesOfLeadEngineerInput)
    measurement_point_actual_tdvs = graphene.List(
        UnderCategoriesOfLeadEngineerInput)
    rubber_cements = graphene.List(UnderCategoriesOfLeadEngineerInput)
    vulcanization_steps = graphene.List(VulcanizationStepInput)
    final_inspection_dimensions_checks = graphene.List(
        UnderCategoriesOfLeadEngineerInput)


class CoatingOperatorInput(InputObjectType):
    id = graphene.Int()
    data = graphene.String()

    mix_dates = graphene.List(UnderCategoriesOfLeadEngineerInput)
    layers = graphene.List(UnderCategoriesOfLeadEngineerInput)
    measurement_point_operators = graphene.List(
        UnderCategoriesOfLeadEngineerInput)


class VulcanizationOperatorInput(InputObjectType):
    id = graphene.Int()
    data = graphene.String()

    coating_operators = graphene.List(CoatingOperatorInput)
    measurement_point_operators = graphene.List(
        UnderCategoriesOfLeadEngineerInput)


class RubberCementOperatorInput(InputObjectType):
    id = graphene.Int()
    data = graphene.String()

    mix_dates = graphene.List(
        UnderCategoriesOfLeadEngineerInput)


class OperatorInput(InputObjectType):
    id = graphene.Int()
    data = graphene.String()
    surface_cleanliness_image = Upload(required=False)

    measurement_point_actual_tdvs = graphene.List(
        UnderCategoriesOfLeadEngineerInput)
    vulcanization_operators = graphene.List(VulcanizationOperatorInput)
    additional_custom_test_operators = graphene.List(
        UnderCategoriesOfLeadEngineerInput)
    rubber_cement_operators = graphene.List(
        RubberCementOperatorInput)


class FinalInspectionQualityControlInput(InputObjectType):
    id = graphene.Int()
    data = graphene.String()

    upload_files = graphene.List(UploadFileInput)
    measurement_point_quality_controls = graphene.List(
        UnderCategoriesOfLeadEngineerInput)
    hardness_quality_controls = graphene.List(
        UnderCategoriesOfLeadEngineerInput)
    peel_test_quality_controls = graphene.List(
        UnderCategoriesOfLeadEngineerInput)
    final_inspection_custom_test_quality_controls = graphene.List(
        UnderCategoriesOfLeadEngineerInput)
    final_inspection_dimensions_check_quality_controls = graphene.List(
        UnderCategoriesOfLeadEngineerInput)


class ListId(InputObjectType):
    id = graphene.Int()


def delete_files(upload_files, foreignkey_model, foreign_key):
    old_upload_files = UploadFile.objects.filter(
        **{foreignkey_model: foreign_key})
    for upload_file in upload_files:
        if isinstance(upload_file["file"],  str):
            old_upload_files = old_upload_files.exclude(
                file=upload_file["file"])
        elif isinstance(upload_file["file"],  dict):
            old_upload_files = old_upload_files.exclude(
                file="document/"+upload_file["file"]["name"])
    old_upload_files.delete()


class ProjectGraphql(graphene.Mutation):
    new = graphene.Field(ProjectNode)

    class Arguments:

        projects = graphene.List(ProjectInput)

    @staticmethod
    def mutate(root, info, projects):
        for project in projects:
            query_project = save.project(project)
            if "descriptions" in project:
                for description in project["descriptions"]:
                    description["foreignKey"] = query_project.id
                    query_description = save.description(description)
                    if "items" in description:
                        for item in description["items"]:
                            item["foreignKey"] = query_description.id
                            query_item = save.item(item)
                    if "upload_files" in description:
                        delete_files(
                            description["upload_files"], 'description', query_description)
                        # old_upload_files = UploadFile.objects.filter(
                        #     description=query_description)
                        # for upload_file in description["upload_files"]:
                        #     if isinstance(upload_file["file"],  str):
                        #         old_upload_files = old_upload_files.exclude(
                        #             file=upload_file["file"])
                        #     elif isinstance(upload_file["file"],  dict):
                        #         old_upload_files = old_upload_files.exclude(
                        #             file="document/"+upload_file["file"]["name"])
                        # old_upload_files.delete()

                        for upload_file in description["upload_files"]:
                            _ = save.upload_file(
                                upload_file, Description, 'description', query_description)

        if projects[0].id:
            return ProjectGraphql(new=Project.objects.get(id=projects[0].id))
        else:
            return ProjectGraphql(new=query_project)


class LeadEngineerGraphql(graphene.Mutation):
    new = graphene.Field(LeadEngineerNode)

    class Arguments:
        lead_engineers = graphene.List(LeadEngineerInput)

        description_id = graphene.Int()
        item_id = graphene.Int()

    @staticmethod
    def mutate(root, info, lead_engineers=[], description_id=0, item_id=0):
        def delete(queryset, input_id):
            for i in range(queryset.count()-1, len(input_id)-1, -1):
                queryset[i].delete()

        def save_method(item_id):
            for lead_engineer in lead_engineers:
                lead_engineer["foreignKey"] = item_id
                query_lead_engineer = save.lead_engineer(lead_engineer)
                if "measurement_point_actual_tdvs" in lead_engineer:
                    item = Item.objects.filter(id=item_id)
                    if Operator.objects.filter(item=item.get()).count() == 0:
                        query_operator = Operator.objects.create(
                            item=item.get())
                    else:
                        query_operator = Operator.objects.get(item=item.get())
                    save.new_foreign_key_to_measurement_point_actual_tvd(
                        item, query_operator)
                    queryset = MeasurementPointActualTVD.objects.filter(
                        lead_engineer=query_lead_engineer)
                    delete(
                        queryset, lead_engineer["measurement_point_actual_tdvs"])
                    step = 0
                    for measurement_point_actual_tvd in lead_engineer["measurement_point_actual_tdvs"]:
                        _ = save.measurement_point_actual_tvd(
                            measurement_point_actual_tvd, step, query_lead_engineer)
                        step += 1
                if "final_inspection_custom_tests" in lead_engineer:
                    queryset = FinalInspectionCustomTest.objects.filter(
                        lead_engineer=query_lead_engineer)
                    delete(
                        queryset, lead_engineer["final_inspection_custom_tests"])
                    step = 0
                    for final_inspection_custom_test in lead_engineer["final_inspection_custom_tests"]:
                        _ = save.final_inspection_custom_test(
                            final_inspection_custom_test, step, query_lead_engineer)
                        step += 1
                if "additional_custom_tests" in lead_engineer:
                    queryset = AdditionalCustomTest.objects.filter(
                        lead_engineer=query_lead_engineer)
                    delete(queryset, lead_engineer["additional_custom_tests"])
                    step = 0
                    for additional_custom_test in lead_engineer["additional_custom_tests"]:
                        _ = save.additional_custom_test(
                            additional_custom_test, step, query_lead_engineer)
                        step += 1
                if "final_inspection_dimensions_checks" in lead_engineer:
                    queryset = FinalInspectionDimensionsCheck.objects.filter(
                        lead_engineer=query_lead_engineer)
                    delete(
                        queryset, lead_engineer["final_inspection_dimensions_checks"])
                    step = 0
                    for final_inspection_dimensions_check in lead_engineer["final_inspection_dimensions_checks"]:
                        _ = save.final_inspection_dimensions_check(
                            final_inspection_dimensions_check, step, query_lead_engineer)
                        step += 1
                if "rubber_cements" in lead_engineer:
                    queryset = RubberCement.objects.filter(
                        lead_engineer=query_lead_engineer)
                    delete(queryset, lead_engineer["rubber_cements"])
                    step = 0
                    for rubber_cement in lead_engineer["rubber_cements"]:
                        _ = save.rubber_cement(
                            rubber_cement, step, query_lead_engineer)
                        step += 1
                if "vulcanization_steps" in lead_engineer:
                    queryset = VulcanizationStep.objects.filter(
                        lead_engineer=query_lead_engineer)
                    delete(queryset, lead_engineer["vulcanization_steps"])
                    vul_step = 0
                    for vulcanization_step in lead_engineer["vulcanization_steps"]:
                        query_vulcanization_step = save.vulcanization_step(
                            vulcanization_step, vul_step, query_lead_engineer)
                        vul_step += 1
                        if "coating_layers" in vulcanization_step:
                            queryset = CoatingLayer.objects.filter(
                                vulcanization_step=query_vulcanization_step)
                            delete(
                                queryset, vulcanization_step["coating_layers"])
                            coa_step = 0
                            for coating_layer in vulcanization_step["coating_layers"]:
                                query_coating_layer = save.coating_layer(
                                    coating_layer, coa_step, query_vulcanization_step)
                                coa_step += 1
                                if "cumulative_thickness" in coating_layer:
                                    queryset = CumulativeThickness.objects.filter(
                                        coating_layer=query_coating_layer)
                                    delete(
                                        queryset, coating_layer["cumulative_thickness"])
                                    step = 0
                                    for coating_layer in coating_layer["cumulative_thickness"]:
                                        _ = save.cumulative_thickness(
                                            coating_layer, step, query_coating_layer)
                                        step += 1
            return query_lead_engineer
        if item_id:
            query_lead_engineer = save_method(item_id)
            item = Item.objects.filter(id=item_id)
            item.update(unique=True)
        elif description_id:
            for item in Item.objects.filter(description=description_id, unique=False).order_by('id'):
                query_lead_engineer = save_method(item.id)

        if lead_engineers[0].id:
            return LeadEngineerGraphql(new=LeadEngineer.objects.get(id=lead_engineers[0].id))
        else:
            return LeadEngineerGraphql(new=query_lead_engineer)


class DeleteUploadFile(graphene.Mutation):
    deleted = graphene.Int()

    class Input:
        id = graphene.Int()

    def mutate(root, info, id, **input):
        # login(info)
        upload_file = UploadFile.objects.filter(pk=id).order_by('id')
        if upload_file.count() == 0:
            return DeleteUploadFile(deleted=0)
        upload_file.delete()
        return DeleteUploadFile(deleted=id)


class DeleteProject(graphene.Mutation):
    deleted = graphene.Int()

    class Input:
        id = graphene.Int()

    def mutate(root, info, id=0, **input):
        project = Project.objects.filter(pk=id).order_by('id')
        if project.count() == 0:
            return DeleteProject(deleted=0)
        project.delete()
        return DeleteProject(deleted=id)


class ItemGraphql(graphene.Mutation):
    new = graphene.Field(ItemNode)

    class Input:
        id = graphene.Int()
        itemId = graphene.String()

        seen = graphene.List(graphene.String)
        delete_seen = graphene.Boolean()
        stage = graphene.String()
        qr_code = graphene.String()
        repair = graphene.Boolean()
        unique = graphene.Boolean()

        foreign_key = graphene.Int()

    def mutate(root, info, seen=[], delete_seen=False, **input):
        if "id" in input:
            project = Item.objects.get(id=input["id"]).description.project
        elif "foreign_key" in input:
            project = Description.objects.get(id=input["foreign_key"]).project
        else:
            raise GraphQLError("Need id or foreign key")
        if "itemId" in input:
            if "id" in input and Item.objects.filter(description__project=project, itemId=input["itemId"], id=input["id"]).count() == 0 and Item.objects.filter(description__project=project, itemId=input["itemId"]).count():
                raise GraphQLError("Item ID already exists")
            elif "id" not in input and Item.objects.filter(description__project=project, itemId=input["itemId"]).count():
                raise GraphQLError("Item ID already exists")

        query_item = save.item(input)
        if delete_seen:
            Seen.objects.filter(item=query_item).delete()
        for s in seen:
            Seen.objects.create(seen=s, item=query_item)

        return ItemGraphql(new=query_item)


class DeleteItem(graphene.Mutation):
    deleted = graphene.Int()

    class Input:
        id = graphene.Int()

    def mutate(root, info, id=0, **input):
        # login(info)
        item = Item.objects.filter(pk=id).order_by('id')
        if item.count() == 0:
            return DeleteItem(deleted=0)
        item.delete()
        return DeleteItem(deleted=id)


class OperatorBachingInput(InputObjectType):
    id = graphene.Int()
    data = graphene.String()

    additional_custom_test_operators = graphene.List(
        UnderCategoriesOfLeadEngineerInput)


class OperatorBachingGraphql(graphene.Mutation):
    batching = graphene.Field(ProjectNode)

    class Arguments:
        item_id_list = graphene.List(graphene.Int, required=True)
        stage = graphene.String()

        operators = graphene.List(OperatorBachingInput)
        vulcanization_operators = graphene.List(
            UnderCategoriesOfLeadEngineerInput)
        # measurement_point_operators = graphene.List(
        #     UnderCategoriesOfLeadEngineerInput)
        step = graphene.Int()

    @staticmethod
    def mutate(root, info, item_id_list, stage=None, operators=[],
               vulcanization_operators=[], measurement_point_operators=[], step=0):
        for item_id in item_id_list:
            item = Item.objects.filter(id=item_id)
            for operator in operators:
                try:
                    id = Operator.objects.get(item=item.get()).id
                except:
                    id = 0
                operator["id"] = id
                query_operator = save.operator(operator, 0, item.get())
                if "additional_custom_test_operators" in operator:
                    step = 0
                    for additional_custom_test_operator in operator["additional_custom_test_operators"]:
                        _ = save.additional_custom_test_operator(
                            additional_custom_test_operator, step, query_operator)
                        step += 1
            for vulcanization_operator in vulcanization_operators:
                operator_id = Operator.objects.get(item=item.get())
                save.vulcanization_operator(
                    vulcanization_operator, step, operator_id)
            # for measurement_point_operator in measurement_point_operators:
            #     vulcanization_operator_id = VulcanizationOperator.objects.filter(
            #         operator__item=item.get()).order_by('id')[step]
            #     save.vulcanization_operator(
            #         measurement_point_operator, vulcanization_operator_id, VulcanizationOperator, "vulcanization_operator")
            if stage:
                item.update(stage=stage)

        item = Item.objects.get(id=item_id_list[0])
        return OperatorBachingGraphql(batching=item.description.project)


class OperatorGraphql(graphene.Mutation):
    new = graphene.Field(OperatorNode)

    class Arguments:
        operators = graphene.List(OperatorInput)

        stage = graphene.String()
        item_id = graphene.Int()

    @staticmethod
    def mutate(root, info, stage=None, item_id=0, operators=None):
        def delete(queryset, input_id):
            for i in range(queryset.count()-1, len(input_id)-1, -1):
                queryset[i].delete()
        for operator in operators:
            item = Item.objects.filter(id=item_id)
            query_operator = save.operator(operator, 0, item[0])
            if "rubber_cement_operators" in operator:
                queryset = RubberCementOperator.objects.filter(
                    operator=query_operator)
                delete(queryset, operator["rubber_cement_operators"])
                rubber_cement_operators_step = 0
                for rubber_cement_operator in operator["rubber_cement_operators"]:
                    query_rubber_cement_operator = save.rubber_cement_operator(
                        rubber_cement_operator, rubber_cement_operators_step, query_operator)
                    rubber_cement_operators_step += 1
                    if "mix_dates" in rubber_cement_operator:
                        queryset = MixDate.objects.filter(
                            rubber_cement_operator=query_rubber_cement_operator)
                        delete(queryset, rubber_cement_operator["mix_dates"])
                        mix_date_step = 0
                        for mix_date in rubber_cement_operator["mix_dates"]:
                            _ = save.mix_date(
                                mix_date, mix_date_step, query_rubber_cement_operator)
                            mix_date_step += 1
            if "measurement_point_actual_tdvs" in operator:
                step = 0
                for measurement_point_actual_tvd in operator["measurement_point_actual_tdvs"]:
                    _ = save.update_measurement_point_actual_tvd(
                        measurement_point_actual_tvd, step, query_operator, item)
                    step += 1
            if "additional_custom_test_operators" in operator:
                queryset = AdditionalCustomTestOperator.objects.filter(
                    operator=query_operator)
                delete(queryset, operator["additional_custom_test_operators"])
                step = 0
                for additional_custom_test_operator in operator["additional_custom_test_operators"]:
                    _ = save.additional_custom_test_operator(
                        additional_custom_test_operator, step, query_operator)
                    step += 1
            if "vulcanization_operators" in operator:
                queryset = VulcanizationOperator.objects.filter(
                    operator=query_operator)
                delete(queryset, operator["vulcanization_operators"])
                vul_step = 0
                for vulcanization_operator in operator["vulcanization_operators"]:
                    query_vulcanization_operator = save.vulcanization_operator(
                        vulcanization_operator, vul_step, query_operator)
                    vul_step += 1
                    if "measurement_point_operators" in vulcanization_operator:
                        queryset = MeasurementPointOperator.objects.filter(
                            vulcanization_operator=query_vulcanization_operator)
                        delete(
                            queryset, vulcanization_operator["measurement_point_operators"])
                        measurement_point = 0
                        for measurement_point_operator in vulcanization_operator["measurement_point_operators"]:
                            _ = save.measurement_point_operator(
                                measurement_point_operator, measurement_point, query_vulcanization_operator, VulcanizationOperator, "vulcanization_operator")
                            measurement_point += 1

                    if "coating_operators" in vulcanization_operator:
                        queryset = CoatingOperator.objects.filter(
                            vulcanization_operator=query_vulcanization_operator)
                        delete(
                            queryset, vulcanization_operator["coating_operators"])
                        coa_step = 0

                        for coating_operator in vulcanization_operator["coating_operators"]:
                            query_coating_operator = save.coating_operator(
                                coating_operator, coa_step, query_vulcanization_operator)

                            coa_step += 1
                            if "layers" in coating_operator:
                                queryset = Layer.objects.filter(
                                    coating_operator=query_coating_operator)
                                delete(queryset, coating_operator["layers"])
                                layers_step = 0
                                for layer in coating_operator["layers"]:
                                    _ = save.layer(
                                        layer, layers_step, query_coating_operator)
                                    layers_step += 1
                            if "measurement_point_operators" in coating_operator:
                                queryset = MeasurementPointOperator.objects.filter(
                                    coating_operator=query_coating_operator)
                                delete(
                                    queryset, coating_operator["measurement_point_operators"])
                                mp_step = 0
                                for measurement_point_operator in coating_operator["measurement_point_operators"]:
                                    _ = save.measurement_point_operator(
                                        measurement_point_operator, mp_step, query_coating_operator)
                                    mp_step += 1
        if stage:
            item.update(stage=stage)
        return OperatorGraphql(new=query_operator)


class FinalInspectionQualityControlGraphql(graphene.Mutation):
    new = graphene.Field(FinalInspectionQualityControlNode)

    class Arguments:
        final_inspection_quality_controls = graphene.List(
            FinalInspectionQualityControlInput)
        item_id = graphene.Int()

    @staticmethod
    def mutate(root, info, final_inspection_quality_controls=None, item_id=None):

        def delete(queryset, input_id):
            for i in range(queryset.count()-1, len(input_id)-1, -1):
                queryset[i].delete()

        for final_inspection_quality_control in final_inspection_quality_controls:
            item = Item.objects.filter(id=item_id)
            query_final_inspection_quality_control = save.final_inspection_quality_control(
                final_inspection_quality_control, 0, item[0])
            if "measurement_point_quality_controls" in final_inspection_quality_control:
                queryset = MeasurementPointQualityControl.objects.filter(
                    final_inspection_quality_control=query_final_inspection_quality_control)
                delete(
                    queryset, final_inspection_quality_control["measurement_point_quality_controls"])
                step = 0
                for measurement_point_quality_control in final_inspection_quality_control["measurement_point_quality_controls"]:
                    _ = save.measurement_point_quality_control(
                        measurement_point_quality_control, step, query_final_inspection_quality_control)
                    step += 1
            if "hardness_quality_controls" in final_inspection_quality_control:
                queryset = HardnessQualityControl.objects.filter(
                    final_inspection_quality_control=query_final_inspection_quality_control)
                delete(
                    queryset, final_inspection_quality_control["hardness_quality_controls"])
                step = 0
                for hardness_quality_control in final_inspection_quality_control["hardness_quality_controls"]:
                    _ = save.hardness_quality_control(
                        hardness_quality_control, step, query_final_inspection_quality_control)
                    step += 1
            if "peel_test_quality_controls" in final_inspection_quality_control:
                queryset = PeelTestQualityControl.objects.filter(
                    final_inspection_quality_control=query_final_inspection_quality_control)
                delete(
                    queryset, final_inspection_quality_control["peel_test_quality_controls"])
                step = 0
                for peel_test_quality_control in final_inspection_quality_control["peel_test_quality_controls"]:
                    _ = save.peel_test_quality_control(
                        peel_test_quality_control, step, query_final_inspection_quality_control)
                    step += 1
            if "final_inspection_custom_test_quality_controls" in final_inspection_quality_control:
                queryset = FinalInspectionCustomTestQualityControl.objects.filter(
                    final_inspection_quality_control=query_final_inspection_quality_control)
                delete(
                    queryset, final_inspection_quality_control["final_inspection_custom_test_quality_controls"])
                step = 0
                for final_inspection_custom_test_quality_control in final_inspection_quality_control["final_inspection_custom_test_quality_controls"]:
                    _ = save.final_inspection_custom_test_quality_control(
                        final_inspection_custom_test_quality_control, step, query_final_inspection_quality_control)
                    step += 1
            if "final_inspection_dimensions_check_quality_controls" in final_inspection_quality_control:
                queryset = FinalInspectionDimensionsCheckQualityControl.objects.filter(
                    final_inspection_quality_control=query_final_inspection_quality_control)
                delete(
                    queryset, final_inspection_quality_control["final_inspection_dimensions_check_quality_controls"])
                step = 0
                for final_inspection_dimensions_check_quality_control in final_inspection_quality_control["final_inspection_dimensions_check_quality_controls"]:
                    _ = save.final_inspection_dimensions_check_quality_control(
                        final_inspection_dimensions_check_quality_control, step, query_final_inspection_quality_control)
                    step += 1
            if "upload_files" in final_inspection_quality_control:
                delete_files(
                    final_inspection_quality_control["upload_files"], 'final_inspection_quality_control', query_final_inspection_quality_control)

                for upload_file in final_inspection_quality_control["upload_files"]:
                    _ = save.upload_file(upload_file, FinalInspectionQualityControl,
                                         'final_inspection_quality_control', query_final_inspection_quality_control)

        return FinalInspectionQualityControlGraphql(new=query_final_inspection_quality_control)


class Mutation(graphene.ObjectType):
    projects = ProjectGraphql.Field()
    project_delete = DeleteProject.Field()
    item_delete = DeleteItem.Field()
    item = ItemGraphql.Field()
    upload_file_delete = DeleteUploadFile.Field()
    lead_engineers = LeadEngineerGraphql.Field()
    operators_baching = OperatorBachingGraphql.Field()
    operators = OperatorGraphql.Field()
    final_inspection_quality_controls = FinalInspectionQualityControlGraphql.Field()
