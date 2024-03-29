from django.urls import path
from . import views


urlpatterns = [
    path('notes/', views.NoteList.as_view()),
    path('notes/<int:pk>/', views.NoteDetail.as_view()),
    path('notes/predict/', views.NotePrediction.as_view()),
]
