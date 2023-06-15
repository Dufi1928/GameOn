from django.db import models
from django.contrib.auth.models import AbstractUser
from games.models import Game
from django.conf import settings


class User(AbstractUser):
    username = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(max_length=100, unique=True)
    gender = models.BooleanField(blank=True, null=True)
    online = models.BooleanField(blank=True, null=True)
    small_size_avatar = models.CharField(max_length=100, blank=True, null=True)
    big_size_avatar = models.CharField(max_length=100, blank=True, null=True)
    favorite_games = models.ManyToManyField(Game, limit_choices_to=5, blank=True)
    short_description = models.CharField(max_length=255, blank=True, null=True)
    pseudo = models.CharField(max_length=100, null=True)
    friends = models.ManyToManyField("self", blank=True)
    age = models.IntegerField(null=True)
    public_key = models.TextField(null=True, blank=True)
    private_key = models.TextField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []



