from django.contrib import admin
from . import models
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User, Group


class ProfileInline(admin.StackedInline):
    model = models.UserProfile
    can_delete = False
    verbose_name_plural = 'UserProfile'
    fk_name = 'user'


class CustomUserAdmin(UserAdmin):
    inlines = (ProfileInline, )

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super(CustomUserAdmin, self).get_inline_instances(request, obj)


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)


admin.site.unregister(Group)

admin.site.register(models.Project)
admin.site.register(models.Description)
admin.site.register(models.Item)
admin.site.register(models.Seen)
admin.site.register(models.UploadFile)
admin.site.register(models.LeadEngineer)
admin.site.register(models.RubberCement)
admin.site.register(models.MeasurementPointActualTVD)
admin.site.register(models.VulcanizationStep)
admin.site.register(models.CoatingLayer)
admin.site.register(models.CumulativeThickness)
admin.site.register(models.Operator)
admin.site.register(models.CoatingOperator)
admin.site.register(models.FinalInspectionDimensionsCheck)
admin.site.register(models.HardnessQualityControl)
admin.site.register(models.VulcanizationOperator)
admin.site.register(models.MixDate)
admin.site.register(models.FinalInspectionQualityControl)
admin.site.register(models.MeasurementPointOperator)
admin.site.register(models.MeasurementPointQualityControl)
admin.site.register(models.FinalInspectionCustomTestQualityControl)
admin.site.register(models.FinalInspectionDimensionsCheckQualityControl)
