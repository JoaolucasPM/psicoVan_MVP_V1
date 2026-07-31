from django.urls import path

from .views import AccountsDetail, AccountsList, LoginView

urlpatterns = [
    path("", AccountsList.as_view()),
    path("login/", LoginView.as_view()),
    path("<int:pk>/", AccountsDetail.as_view()),
]