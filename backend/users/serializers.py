from rest_framework import serializers
from .models import User
from games.models import Game


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instace = self.Meta.model(**validated_data)
        if password is not None:
            instace.set_password(password)
        instace.save()
        return instace


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'


class GetUserSerializer(serializers.ModelSerializer):
    favorite_games = GameSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'short_description', 'email', 'gender', 'online', 'small_size_avatar',
                  'big_size_avatar', 'favorite_games', 'pseudo', 'friends', 'age']



class GetUserPseudosSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'pseudo']