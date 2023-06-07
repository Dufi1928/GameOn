from rest_framework import serializers
from .models import Game
from .models import Category


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'title', 'description', 'note', 'likes', 'photos', 'icon']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
