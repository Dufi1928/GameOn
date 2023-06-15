from django.urls import path
from .views import GetGuides, Guide

urlpatterns = [
    path('guides', GetGuides.as_view(), name='GetGuides'),
    path('guide', Guide.as_view(), name='Guide'),
]