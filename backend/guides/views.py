from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import GameGuide
from .serializers import GameGuideSerializer


# Pour obtenir tous les guides
class GetGuides(APIView):
    def get(self, request, format=None):
        guides = GameGuide.objects.all()
        serializer = GameGuideSerializer(guides, many=True)
        return Response(serializer.data)


# Pour obtenir un guide spécifique en utilisant son ID
class Guide(APIView):
    def get(self, request, format=None):
        guide_id = request.query_params.get('id')
        try:
            guide = GameGuide.objects.get(id=guide_id)
            serializer = GameGuideSerializer(guide)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except GameGuide.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)