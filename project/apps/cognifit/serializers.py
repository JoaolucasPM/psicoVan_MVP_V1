from rest_framework import serializers


class CognifitRegisterSerializer(serializers.Serializer):
    patient_id = serializers.IntegerField()
    password = serializers.CharField()


class CognifitGameStartSerializer(serializers.Serializer):
    patient_id = serializers.IntegerField()
    game_id = serializers.CharField()