from django.urls import reverse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
# Create your views here.

def index(request):
    return render(request, 'quizapp/index.html')


#Login View is handled by django, as well as logout, and password vies. you do need to create the html templates for each, but it handles the rest. Django authentication is described here https://docs.djangoproject.com/en/2.1/topics/auth/default/

#login_required tells django to look for user authentication in the request, if not it redirects you to the login page.
@login_required
def profile(request):
    user = request.user
    username = user.username
    return render(request, 'quizapp/profile.html', {'username': username})



def createAccount(request):
    if request.method == 'GET':
            form = UserCreationForm()

    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect(reverse('quizapp:profile'))
    
    return render(request, 'quizapp/createaccount.html', {'form': form})

def resetDone(request):
    return render(request, 'registration/resetdone.html')
    