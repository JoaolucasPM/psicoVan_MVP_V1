from django.urls import path

from apps.trainings.views import (
    TrainingDetailView,
    TrainingListCreateView,
)

urlpatterns = [
    path("", TrainingListCreateView.as_view()),
    path("<int:pk>/", TrainingDetailView.as_view()),
]