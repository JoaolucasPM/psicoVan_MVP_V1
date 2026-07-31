from django.urls import include, path

urlpatterns = [
    path("accounts/", include("apps.accounts.urls")),
    path("patients/", include("apps.patients.urls")),
    path("cognifit/", include("apps.cognifit.urls")),
    path("trainings/", include("apps.trainings.urls")),
]