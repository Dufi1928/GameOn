from rest_framework import serializers
from .models import GameGuide, GameGuideComment
from games.serializers import GameSerializer


class GameGuideCommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = GameGuideComment
        fields = ['id', 'author', 'content', 'created_at']

    def get_author(self, obj):
        return {
            "pseudo": obj.author.pseudo,
            "avatar": obj.author.small_size_avatar,
        }


class GameGuideSerializer(serializers.ModelSerializer):
    game = GameSerializer()  # Serializer for the game field
    comments = GameGuideCommentSerializer(many=True, read_only=True)

    class Meta:
        model = GameGuide
        fields = ['id', 'game', 'cover_image', 'title', 'created_at', 'content', 'content_images', 'comments']
