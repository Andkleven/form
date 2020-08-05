from django.urls import include, path, re_path
from django.contrib import admin
from rest_framework.authtoken import views
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from graphene_file_upload.django import FileUploadGraphQLView
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('graphql/', csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),
    path('', include('backend.app.urls')),
    re_path('.*', TemplateView.as_view(template_name='index.html'))
]
