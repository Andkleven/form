from django.urls import include, path
from django.contrib import admin
from rest_framework.authtoken import views
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from graphene_file_upload.django import FileUploadGraphQLView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('graphql/', csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),
    path('', include('backend.app.urls')),
]
