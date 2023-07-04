from django.test import TestCase, RequestFactory
from users.models import User
from games.models import Game
from django.test.client import Client
from rest_framework.test import APIClient
from .models import Blog
from .views import BlogList
import jwt

class BlogListTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.view = BlogList.as_view()
        self.uri = 'https://mygameon.pro:8000/api/blogList'
        self.user = User.objects.create_user(username='test', password='040998')
        self.client = APIClient()

    def test_blog_list_with_token(self):
        # Création d'un token
        payload = {'id': self.user.id}
        token = jwt.encode(payload, 'secret', algorithm='HS256')

        # Création d'un blog
        game1 = Game.objects.create(title="game1", note=4.5, likes=0)

        Blog.objects.create(title="blog1", author=self.user, game=game1)

        # Ajout de game1 aux jeux favoris de l'utilisateur
        self.user.favorite_games.add(game1)

        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.get(self.uri)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['title'], 'blog1')

    def test_blog_list_without_token(self):
        # Création de 21 blogs
        for i in range(21):
            game = Game.objects.create(title=f"game{i}", note=4.5, likes=0)

            Blog.objects.create(title=f"blog{i}", author=self.user, game=game)

        response = self.client.get(self.uri)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 20)
