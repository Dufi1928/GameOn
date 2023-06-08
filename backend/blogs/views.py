import jwt
from django.db.models import Count
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Blog
from .serializers import BlogSerializer
from users.models import User


class BlogList(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if token:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
            user_id = payload['id']

            # Récupérer les jeux favoris de l'utilisateur
            user = User.objects.get(id=user_id)
            favorite_games = user.favorite_games.all()

            # Renvoyer les blogs correspondant aux jeux favoris de l'utilisateur
            blogs = Blog.objects.filter(game__in=favorite_games)
            serializer = BlogSerializer(blogs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Renvoyer les 20 blogs avec le plus de commentaires
            blogs = Blog.objects.annotate(num_comments=Count('comments')).order_by('-num_comments')[:20]
            serializer = BlogSerializer(blogs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


class GetBlog(APIView):

    def post(self, request):
        blog_id = request.data.get('id')
        try:
            blog = Blog.objects.get(id=blog_id)
            serializer = BlogSerializer(blog)
            return Response(serializer.data)
        except Blog.DoesNotExist:
            return Response({'error': 'Blog not found'}, status=404)
