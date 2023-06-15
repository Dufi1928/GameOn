from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from .serializers import UserSerializerWithPrivateKet
from .models import Message
from django.db.models import Q
from .serializers import MessageSerializerForUser

User = get_user_model()


class UserResiverInfoApi(APIView):
    def post(self, request):
        reciver_id = request.data.get('reciver_id')
        try:
            user = User.objects.get(id=reciver_id)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(status=404)


class UserInfoAPI(APIView):
    def post(self, request):
        user_id = request.data.get('userId')
        try:
            user = User.objects.get(id=user_id)
            serializer = UserSerializerWithPrivateKet(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(status=404)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 1000


class GetMessages(APIView):
    def post(self, request):
        interlocutor_id = request.data.get('interlocutor_id')

        # If interlocutor_id is not provided, return an error
        if not interlocutor_id:
            return Response({"error": "interlocutor_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch all messages where interlocutor_id is either sender or receiver
        messages = Message.objects.filter(
            Q(sender__id=interlocutor_id) | Q(receiver__id=interlocutor_id)
        ).select_related('sender', 'receiver').order_by('-timestamp')

        paginator = StandardResultsSetPagination()
        paginated_messages = paginator.paginate_queryset(messages, request)

        # Serialize the messages
        serializer = MessageSerializerForUser(paginated_messages, many=True)

        return paginator.get_paginated_response(serializer.data)
