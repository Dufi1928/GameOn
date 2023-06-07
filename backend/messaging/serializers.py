from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Message

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'pseudo', 'email', 'small_size_avatar', 'online']


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'timestamp', 'read']


class UserIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id']


class UserSerializerForMessage(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id']


class MessageSerializerForUser(serializers.ModelSerializer):
    sender_id = serializers.PrimaryKeyRelatedField(source='sender.id', read_only=True)
    receiver_id = serializers.PrimaryKeyRelatedField(source='receiver.id', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender_id', 'receiver_id', 'content', 'timestamp', 'read']

