from django.db import models
from django.conf import settings
from games.models import Game
from django.contrib.postgres.fields import ArrayField


class GameGuide(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='game_guides')
    cover_image = models.CharField(max_length=255)
    title = models.CharField(max_length=255, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    content_images = ArrayField(models.CharField(max_length=255), size=None, default=list)
    content = models.TextField(default='')
    def __str__(self):
        return f"Guide for {self.game.title}"


class GameGuideComment(models.Model):
    game_guide = models.ForeignKey(GameGuide, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author} on {self.game_guide}"
