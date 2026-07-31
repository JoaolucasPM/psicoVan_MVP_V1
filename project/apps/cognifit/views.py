from rest_framework import generics, status
from rest_framework.response import Response

from apps.cognifit.serializers import (
    CognifitRegisterSerializer,
    CognifitGameStartSerializer,
)
from apps.cognifit.services import (
    register_patient_in_cognifit,
    get_cognifit_game_session,
)


class CognifitRegisterView(generics.CreateAPIView):
    serializer_class = CognifitRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        patient = register_patient_in_cognifit(
            serializer.validated_data["patient_id"],
            serializer.validated_data["password"],
        )

        return Response(
            {
                "patient_id": patient.id,
                "cognifit_user_token": patient.cognifit_user_token,
            },
            status=status.HTTP_201_CREATED,
        )


class CognifitGameStartView(generics.CreateAPIView):
    serializer_class = CognifitGameStartSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = get_cognifit_game_session(
            serializer.validated_data["patient_id"],
            serializer.validated_data["game_id"],
        )

        return Response(
            data,
            status=status.HTTP_200_OK,
        )