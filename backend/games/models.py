from django.db import models
from django.contrib.postgres.fields import ArrayField


class Category(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return self.name


class Game(models.Model):
    title = models.CharField(max_length=64)
    description = models.TextField()
    note = models.FloatField()
    likes = models.IntegerField()
    photos = ArrayField(models.CharField(max_length=255), size=None, default=list)
    icon = models.CharField(max_length=255)
    category = models.ManyToManyField(Category)

    def __str__(self):
        return self.title
