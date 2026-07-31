from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from apps.patients.models import Patient


class PatientsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "password",
            "birthday",
            "sex",
            "locale",
            "cognifit_user_token",
            "created_by",
        ]

        extra_kwargs = {
            "password": {
                "write_only": True,
            }
        }

    def create(self, validated_data):
        validated_data["password"] = make_password(
            validated_data["password"]
        )

        return super().create(validated_data)