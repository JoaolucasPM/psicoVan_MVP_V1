from rest_framework import serializers

from .models import Accounts


class AccountsSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Accounts
        fields = [
            "id",
            "name",
            "email",
            "password",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = Accounts(**validated_data)
        user.set_password(password)
        user.save()

        return user