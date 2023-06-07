from django.urls import path
from .views import BlogList

urlpatterns = [
    path('blogList/', BlogList.as_view(), name='blog-list'),
]
