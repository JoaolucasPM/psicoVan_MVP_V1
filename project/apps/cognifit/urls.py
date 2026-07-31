from django.urls import path

from apps.cognifit.views import (
    CognifitRegisterView,
    CognifitGameStartView,
)

urlpatterns = [
    path(
        "register/",
        CognifitRegisterView.as_view(),
        name="cognifit-register",
    ),
    path(
        "games/start/",
        CognifitGameStartView.as_view(),
        name="cognifit-game-start",
    ),
]