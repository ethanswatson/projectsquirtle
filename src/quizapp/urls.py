
from django.urls import path, include

from . import views

app_name = 'quizapp'

urlpatterns = [
    path('', views.index, name='index'),
    path('createaccount/', views.createAccount, name='createAccount'),
    path('accounts/profile/', views.profile, name='profile'),
    path('accounts/createQuiz/', views.createQuiz, name='createQuiz'),
    path('accounts/deleteQuiz/', views.deleteQuiz, name='deleteQuiz'),
    path('accounts/deleteQuestion/', views.deleteQuestion, name='deleteQuestion'),
    path('accounts/deleteAnswer/', views.deleteAnswer, name='deleteAnswer'),
    path('accounts/editQuiz/quiz-<int:quizID>/', views.editQuiz, name = 'editQuiz'),
    path('accounts/editQuestion/quiz-<int:quizID>/question-<int:questionID>', views.editQuestion, name = 'editQuestion'),
    path('accounts/', include('django.contrib.auth.urls')),
]



#path('accounts/', include('django.contrib.auth.urls')), includes everything down below
    #accounts/login/ [name='login']
    #accounts/logout/ [name='logout']
    #accounts/password_change/ [name='password_change']
    #accounts/password_change/done/ [name='password_change_done']
    #accounts/password_reset/ [name='password_reset']
    #accounts/password_reset/done/ [name='password_reset_done']
    #accounts/reset/<uidb64>/<token>/ [name='password_reset_confirm']
    #accounts/reset/done/ [name='password_reset_complete']