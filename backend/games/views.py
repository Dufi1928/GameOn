from rest_framework.response import Response
from .models import Game
from .serializers import GameSerializer
from rest_framework.views import APIView
from rest_framework import status


class Games(APIView):
    def get(self, request):
        games = Game.objects.all()
        if not games:
            return Response({"detail": "Pas de jeux disponibles"}, status=status.HTTP_404_NOT_FOUND)
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data)
