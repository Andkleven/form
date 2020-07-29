from django.db import models
from django.urls import reverse
from django.db.models import Q
from django.contrib.auth.models import User
from django.conf import settings
from django.core.exceptions import ValidationError
from datetime import datetime
from django.core.validators import MaxValueValidator, MinValueValidator
from itertools import chain
from django.db.models.signals import post_save
from django.dispatch import receiver
from django import forms
from decimal import Decimal
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.postgres.fields import ArrayField


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class Project(models.Model):
    data = models.TextField(blank=True, null=True)

    lead_engineer_done = models.BooleanField(default=False)

    def get_absolute_url(self):
        return f"{self.id}/"


class Description(models.Model):
    data = models.TextField(blank=True, null=True)

    project = models.ForeignKey(Project, related_name='descriptions',
                                on_delete=models.SET_NULL, default='', null=True, blank=True)

    def get_absolute_url(self):
        return f"{self.id}/"


class Item(models.Model):
    itemId = models.TextField(blank=True, null=True)

    stage = models.CharField(
        max_length=200, default='', null=False, blank=True)
    qr_code = models.CharField(
        max_length=200, default='', null=False, blank=True)
    repair = models.BooleanField(default=False)
    unique = models.BooleanField(default=False)

    description = models.ForeignKey(
        Description, related_name='items', on_delete=models.SET_NULL, default='', null=True, blank=True)


class Seen(models.Model):
    seen = models.CharField(max_length=200, default='', null=False, blank=True)

    item = models.ForeignKey(Item, related_name='seen',
                             on_delete=models.SET_NULL, default='', blank=True, null=True)


class LeadEngineer(models.Model):
    data = models.TextField(blank=True, null=True)

    item = models.ForeignKey(Item, related_name='lead_engineers',
                             on_delete=models.SET_NULL, default='', blank=True, null=True)

    def get_absolute_url(self):
        return f"{self.id}/"


class FinalInspectionCustomTest(models.Model):
    data = models.TextField(blank=True, null=True)

    lead_engineer = models.ForeignKey(LeadEngineer, related_name='final_inspection_custom_tests',
                                      on_delete=models.SET_NULL, default='', blank=True, null=True)


class AdditionalCustomTest(models.Model):
    data = models.TextField(blank=True, null=True)

    lead_engineer = models.ForeignKey(LeadEngineer, related_name='additional_custom_tests',
                                      on_delete=models.SET_NULL, default='', blank=True, null=True)


class FinalInspectionDimensionsCheck(models.Model):
    data = models.TextField(blank=True, null=True)

    lead_engineer = models.ForeignKey(LeadEngineer, related_name='final_inspection_dimensions_checks',
                                      on_delete=models.SET_NULL, default='', blank=True, null=True)


class RubberCement(models.Model):
    data = models.TextField(blank=True, null=True)

    lead_engineer = models.ForeignKey(
        LeadEngineer, related_name='rubber_cements', on_delete=models.SET_NULL, default='', blank=True, null=True)


class VulcanizationStep(models.Model):
    data = models.TextField(blank=True, null=True)

    lead_engineer = models.ForeignKey(LeadEngineer, related_name='vulcanization_steps',
                                      on_delete=models.SET_NULL, default='', blank=True, null=True)


class CoatingLayer(models.Model):
    data = models.TextField(blank=True, null=True)

    vulcanization_step = models.ForeignKey(
        VulcanizationStep, related_name='coating_layers', on_delete=models.SET_NULL, default='', blank=True, null=True)


class CumulativeThickness(models.Model):
    data = models.TextField(blank=True, null=True)

    coating_layer = models.ForeignKey(CoatingLayer, related_name='cumulative_thickness',
                                      on_delete=models.SET_NULL, default='', blank=True, null=True)


class Operator(models.Model):
    data = models.TextField(blank=True, null=True)

    item = models.ForeignKey(Item, related_name='operators',
                             on_delete=models.SET_NULL, default='', blank=True, null=True)
    surface_cleanliness_image = models.FileField(
        upload_to='document/', null=True, blank=True)

    # def save(self, *args, **kwargs):
    #     super().save(*args, **kwargs)
    #     if self.dust_check_image:
    #         img = Image.open(self.dust_check_image.path)
    #         if img.height > 300 or img.width > 300:
    #             output_size = (300, 300)
    #             img.thumbnail(output_size)
    #             img.save(self.dust_check_image.path)

    #     if self.image_surface_cleanliness:
    #         img = Image.open(self.image_surface_cleanliness.path)
    #         if img.height > 300 or img.width > 300:
    #             output_size = (300, 300)
    #             img.thumbnail(output_size)
    #             img.save(self.image_surface_cleanliness.path)

    def get_absolute_url(self):
        return f"{self.id}/"


class VulcanizationOperator(models.Model):
    data = models.TextField(blank=True, null=True)

    operator = models.ForeignKey(Operator, related_name='vulcanization_operators',
                                 on_delete=models.SET_NULL, default='', blank=True, null=True)


class CoatingOperator(models.Model):
    data = models.TextField(blank=True, null=True)

    vulcanization_operator = models.ForeignKey(
        VulcanizationOperator, related_name='coating_operators', on_delete=models.SET_NULL, default='', blank=True, null=True)


class Layer(models.Model):
    data = models.TextField(blank=True, null=True)

    coating_operator = models.ForeignKey(
        CoatingOperator, related_name='layers', on_delete=models.SET_NULL, default='', blank=True, null=True)


class RubberCementOperator(models.Model):
    data = models.TextField(blank=True, null=True)

    operator = models.ForeignKey(
        Operator, related_name='rubber_cement_operators', on_delete=models.SET_NULL, default='', blank=True, null=True)


class MixDate(models.Model):
    data = models.TextField(blank=True, null=True)

    rubber_cement_operator = models.ForeignKey(
        RubberCementOperator, related_name='mix_dates', on_delete=models.SET_NULL, default='', blank=True, null=True)


class MeasurementPointOperator(models.Model):
    data = models.TextField(blank=True, null=True)

    vulcanization_operator = models.ForeignKey(
        VulcanizationOperator, related_name='measurement_point_operators', on_delete=models.SET_NULL, default='', blank=True, null=True)
    coating_operator = models.ForeignKey(CoatingOperator, related_name='measurement_point_operators',
                                         on_delete=models.SET_NULL, default='', null=True, blank=True)


class AdditionalCustomTestOperator(models.Model):
    data = models.TextField(blank=True, null=True)

    operator = models.ForeignKey(Operator, related_name='additional_custom_test_operators',
                                 on_delete=models.SET_NULL, default='', null=True, blank=True)


class MeasurementPointActualTVD(models.Model):
    data = models.TextField(blank=True, null=True)

    lead_engineer = models.ForeignKey(LeadEngineer, related_name='measurement_point_actual_tdvs',
                                      on_delete=models.SET_NULL, default='', blank=True, null=True)
    operator = models.ForeignKey(Operator, related_name='measurement_point_actual_tdvs',
                                 on_delete=models.SET_NULL, default='', blank=True, null=True)


class FinalInspectionQualityControl(models.Model):
    data = models.TextField(blank=True, null=True)

    item = models.ForeignKey(Item, related_name='final_inspection_quality_controls',
                             on_delete=models.SET_NULL, default='', null=True, blank=True)


class MeasurementPointQualityControl(models.Model):
    data = models.TextField(blank=True, null=True)

    final_inspection_quality_control = models.ForeignKey(
        FinalInspectionQualityControl, related_name='measurement_point_quality_controls', on_delete=models.SET_NULL, default='', null=True, blank=True)


class HardnessQualityControl(models.Model):
    data = models.TextField(blank=True, null=True)

    final_inspection_quality_control = models.ForeignKey(
        FinalInspectionQualityControl, related_name='hardness_quality_controls', on_delete=models.CASCADE, default='', null=True, blank=True)


class PeelTestQualityControl(models.Model):
    data = models.TextField(blank=True, null=True)

    final_inspection_quality_control = models.ForeignKey(
        FinalInspectionQualityControl, related_name='peel_test_quality_controls', on_delete=models.SET_NULL, default='', null=True, blank=True)


class FinalInspectionCustomTestQualityControl(models.Model):
    data = models.TextField(blank=True, null=True)

    final_inspection_quality_control = models.ForeignKey(
        FinalInspectionQualityControl, related_name='final_inspection_custom_test_quality_controls', on_delete=models.SET_NULL, default='', null=True, blank=True)


class FinalInspectionDimensionsCheckQualityControl(models.Model):
    data = models.TextField(blank=True, null=True)

    final_inspection_quality_control = models.ForeignKey(FinalInspectionQualityControl, related_name='final_inspection_dimensions_check_quality_controls',
                                                         on_delete=models.SET_NULL, default='', blank=True, null=True)


class UploadFile(models.Model):
    file = models.FileField(upload_to='document/', null=True, blank=True)
    file_description = models.CharField(
        max_length=2000, default='', null=True, blank=True)

    description = models.ForeignKey(Description, related_name='upload_files',
                                    on_delete=models.SET_NULL, default='', null=True, blank=True)
    operator = models.ForeignKey(Operator, related_name='upload_files',
                                 on_delete=models.SET_NULL, default='', null=True, blank=True)
    final_inspection_quality_control = models.ForeignKey(
        FinalInspectionQualityControl, related_name='upload_files', on_delete=models.SET_NULL, default='', null=True, blank=True)

    def get_absolute_url(self):
        return f"{self.id}/"


class UserProfile(models.Model):
    position_code = (
        ('admin', 'Admin'),
        ('lead', 'Lead Engineer'),
        ('supervisor', 'Supervisor'),
        ('operator', 'Operator'),
        ('quality', 'Quality Control'),
        ('spectator', 'Spectator')
    )
    dep_code = (
        ('Coating', 'Coating'),
        ('Packer', 'Packer'),
        ('Elastopipe', 'Elastopipe'),
    )

    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True)

    role = models.CharField(max_length=200, choices=position_code)
    name = models.CharField(max_length=200, default='')
