from django.urls import path
from .views import UserInfoAPI, GetMessages

app_name = 'messaging'

urlpatterns = [
    path('reciverData', UserInfoAPI.as_view()),
    path('get-messages', GetMessages.as_view()),
]
