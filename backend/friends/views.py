from django.http import JsonResponse
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

User = get_user_model()


class ListFriends(APIView):
    def post(self, request, format=None):
        user_id = request.data.get('user_id')
        print(user_id)
        user = get_object_or_404(User, id=user_id)

        friends = user.friends.all()

        friends_list = list(friends.values('id', 'age', 'username', 'big_size_avatar', 'online', 'gender', 'pseudo'))

        return JsonResponse(friends_list, safe=False)

