from django.db import models
from django.contrib.auth.models import AbstractUser
from games.models import Game


class User(AbstractUser):
    username = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(max_length=100, unique=True)
    favorite_games = models.ManyToManyField(Game, limit_choices_to=5, blank=True)
    pseudo = models.CharField(max_length=100, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
