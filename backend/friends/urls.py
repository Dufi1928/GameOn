from django.urls import path
from .views import ListFriends

urlpatterns = [
    path('friends', ListFriends.as_view()),
]
