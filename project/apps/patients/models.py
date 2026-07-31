from django.db import models
from apps.accounts.models import Accounts


class Patient(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()

    password = models.CharField(
        max_length=128,
        null=True,
        blank=True,
    )

    birthday = models.DateField()
    sex = models.IntegerField()
    locale = models.CharField(max_length=10, default="pt")

    cognifit_user_token = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )

    created_by = models.ForeignKey(
        Accounts,
        on_delete=models.CASCADE,
        related_name="patients",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)