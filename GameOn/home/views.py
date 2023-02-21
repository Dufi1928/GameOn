from django.shortcuts import render, redirect
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login



# Create your views here.
def home(request):
    return render(request, '../templates/home.html')

