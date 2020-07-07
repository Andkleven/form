from django.http import FileResponse
from . import models
from django.shortcuts import get_object_or_404

def files(request, path):
    upload_file = get_object_or_404(models.UploadFile, file='document/'+path)
    return FileResponse(upload_file.file.open()) 