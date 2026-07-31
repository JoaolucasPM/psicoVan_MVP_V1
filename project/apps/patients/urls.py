from django.urls import path

from apps.patients import views
from apps.patients.auth_views import PatientLoginView

urlpatterns = [
    path("", views.PatientsList.as_view()),
    path("login/", PatientLoginView.as_view()),
    path("<int:pk>/", views.PatientsDetail.as_view()),
]