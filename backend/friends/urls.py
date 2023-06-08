from django.urls import path
from .views import ListFriends, FriendRequestView, Checknotif

urlpatterns = [
    path('friends', ListFriends.as_view()),
    path('friend-request', FriendRequestView.as_view()),
    path('notifications', Checknotif.as_view()),
]
