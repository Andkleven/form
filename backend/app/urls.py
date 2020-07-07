from django.urls import include, path
from . import views

app_name = 'app'

urlpatterns = [
    path('file/<str:path>', views.files ,name='file')
]