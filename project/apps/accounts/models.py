from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import AccountsManager


class Accounts(AbstractUser):
    username = None

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    objects = AccountsManager()

    def __str__(self):
        return self.name