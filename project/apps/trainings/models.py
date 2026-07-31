from django.db import models

from apps.accounts.models import Accounts
from apps.patients.models import Patient


class Training(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pendente"),
        ("IN_PROGRESS", "Em andamento"),
        ("COMPLETED", "Concluído"),
    ]

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="trainings",
    )

    created_by = models.ForeignKey(
        Accounts,
        on_delete=models.CASCADE,
        related_name="trainings",
    )

    title = models.CharField(max_length=150)

    game_id = models.CharField(max_length=100)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)