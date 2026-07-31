from rest_framework import serializers

from apps.trainings.models import Training


class TrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = [
            "id",
            "patient",
            "created_by",
            "title",
            "game_id",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]