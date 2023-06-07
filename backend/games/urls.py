from django.urls import path
from .views import Games

urlpatterns = [
    path('games/', Games.as_view(), name='games'),
]