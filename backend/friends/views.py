from django.http import JsonResponse
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import FriendRequest
from .serializers import FriendRequestSerializer
import jwt


User = get_user_model()


class ListFriends(APIView):
    def post(self, request, format=None):
        user_id = request.data.get('user_id')
        user = get_object_or_404(User, id=user_id)

        friends = user.friends.all()

        friends_list = list(friends.values('id', 'age', 'username', 'big_size_avatar', 'online', 'gender', 'pseudo'))

        return JsonResponse(friends_list, safe=False)


class FriendRequestView(APIView):
    def post(self, request):
        # Récupérer l'ID de l'utilisateur à ajouter depuis le corps de la requête
        user_id = request.data.get('user_id')

        # Récupérer le JWT depuis les cookies
        jwt_token = request.COOKIES.get('jwt')


        if jwt_token is None:
            return Response({"error": "JWT token missing"}, status=status.HTTP_400_BAD_REQUEST)

        jwt_token_bytes = jwt_token.encode()  # conversion en bytes
        payload = jwt.decode(jwt_token_bytes, 'secret', algorithms=['HS256'])

        if user_id:
            try:
                # Vérifier le JWT et récupérer l'utilisateur
                user = User.objects.get(id=payload['id'])

                # Créer la demande d'ami
                friend_request = FriendRequest(sender=user, receiver_id=user_id)
                friend_request.save()

                return Response(status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "User ID missing"}, status=status.HTTP_400_BAD_REQUEST)


class Checknotif(APIView):
    def get(self, request):
        jwt_token = request.COOKIES.get('jwt')

        if jwt_token is None:
            return Response({"error": "JWT token missing"}, status=status.HTTP_400_BAD_REQUEST)

        jwt_token_bytes = jwt_token.encode()  # conversion en bytes
        payload = jwt.decode(jwt_token_bytes, 'secret', algorithms=['HS256'])

        # Requête pour obtenir les demandes d'amis en attente
        friend_requests = FriendRequest.objects.filter(receiver=get_user_model().objects.get(id=payload['id']),
                                                       status=FriendRequest.PENDING)

        # Sérialisation des demandes d'amis
        serializer = FriendRequestSerializer(friend_requests, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)



