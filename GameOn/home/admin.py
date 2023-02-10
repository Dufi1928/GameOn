from django.contrib import admin
from .models import NewsBlog, Category, TipsBlog, Review, Game, Answer, Question, Forum, Message
# Register your models here.
admin.site.register(NewsBlog)
admin.site.register(Category)
admin.site.register(TipsBlog)
admin.site.register(Review)
admin.site.register(Game)
admin.site.register(Answer)
admin.site.register(Question)
admin.site.register(Forum)

