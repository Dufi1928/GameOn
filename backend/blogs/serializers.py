from rest_framework import serializers
from .models import Blog, Comment
from games.models import Game

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()

    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at']


class BlogSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    game = serializers.PrimaryKeyRelatedField(queryset=Game.objects.all())

    comments = CommentSerializer(many=True, read_only=True)
    num_comments = serializers.SerializerMethodField()

    def get_num_comments(self, obj):
        return obj.comments.count()

    class Meta:
        model = Blog
        fields = ['id', 'title', 'large_photo', 'small_photo', 'short_description', 'author', 'content', 'game', 'created_at', 'updated_at', 'comments', 'num_comments']
