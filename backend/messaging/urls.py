from django.urls import path
from .views import UserResiverInfoApi,UserInfoAPI, GetMessages

app_name = 'messaging'

urlpatterns = [
    path('reciverData', UserResiverInfoApi.as_view()),
    path('userinfo', UserInfoAPI.as_view()),
    path('get-messages', GetMessages.as_view()),
]
