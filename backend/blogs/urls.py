from django.urls import path
from .views import BlogList, GetBlog

urlpatterns = [
    path('blogList', BlogList.as_view(), name='blog-list'),
    path('blog', GetBlog.as_view(), name='blog'),
]
