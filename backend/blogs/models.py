from django.db import models
from django.conf import settings
from games.models import Game


class Blog(models.Model):
    objects = models.Manager()
    title = models.CharField(max_length=100)
    large_photo = models.CharField(max_length=255)
    small_photo = models.CharField(max_length=255)
    short_description = models.CharField(max_length=150)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    content = models.TextField()
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='blogs', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Comment(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author} on {self.blog.title}"
