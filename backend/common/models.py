from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone
# from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import AbstractUser




class Category(models.Model):
    name = models.CharField(max_length=64)
    def __str__(self):
        return f"{self.name}"



class TipsBlog(models.Model):
    title = models.CharField(max_length=64)
    content = models.TextField()
    publication_date = models.DateTimeField()
    def __str__(self):
        return f" Title : {self.title}  Content: {self.content} Publication date: {self.publication_date}"

class Review(models.Model):
    content = models.TextField()

    def __str__(self):
        return f"{self.content}"


class Game(models.Model):
    title = models.CharField(max_length=64)
    description = models.TextField()
    note = models.FloatField()
    likes = models.IntegerField()
    phots = ArrayField(models.CharField(max_length=255),size=None, default=list)
    tips_blog = models.ForeignKey('TipsBlog', on_delete=models.CASCADE)
    review = models.ForeignKey('Review', on_delete=models.CASCADE, null=True)
    cetegory = models.ManyToManyField('Category')


class Answer(models.Model):
    content = models.TextField()

class Question(models.Model):
    title = models.CharField(max_length=64)
    description = models.TextField()
    answer = models.ForeignKey('Answer', on_delete=models.CASCADE)


class Forum(models.Model):
    title = models.CharField(max_length=64)
    description = models.TextField()
    createdAt = models.DateTimeField(default=timezone.now)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)



class NewsBlog(models.Model):
    subject = models.CharField(max_length=255)
    content = models.TextField()

class Message(models.Model):
    content = models.TextField()












