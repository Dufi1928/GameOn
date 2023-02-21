from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CostumAccountManager(BaseUserManager):
    def create_superuser(self, email, password, user_name, first_name, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if other_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, user_name, first_name, **other_fields)

    def create_user(self, email, user_name,first_name, password, **other_fields):

        if not email:
            raise ValueError(_("Please enter a valid email address."))

        email = self.normalize_email(email)
        user = self.model(email=email, user_name=user_name, first_name=first_name, **other_fields)
        user.set_password(password)
        user.save()
        return user



class NewUser(AbstractBaseUser, PermissionsMixin):
    # Custom fields
    email = models.EmailField(_('Email Adress'),unique=True)
    user_name = models.CharField(_('User Name'),max_length=150)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=150)
    start_date = models.DateField(default=timezone.now)
    bio = models.TextField(_('about'), max_length=500 , null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    age = models.PositiveSmallIntegerField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    object = CostumAccountManager()


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['user_name','first_name']
    def __str__(self):
        return self.user_name

