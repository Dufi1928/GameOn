from django.shortcuts import render,redirect
from django.http import HttpResponseRedirect
from django.contrib.auth.forms import UserCreationForm

# Create your views here.
def signup(request):
    if request.method =='POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html',{'form':form})

def login(request):
    return render(request, 'login.html')