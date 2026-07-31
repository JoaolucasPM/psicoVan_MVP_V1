import logging

from rest_framework import generics, status
from rest_framework.response import Response

from apps.cognifit.serializers import (
    CognifitGameStartSerializer,
    CognifitRegisterSerializer,
)
from apps.cognifit.services import (
    get_cognifit_game_session,
    register_patient_in_cognifit,
)


logger = logging.getLogger(__name__)


class CognifitRegisterView(generics.CreateAPIView):
    serializer_class = CognifitRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            patient = register_patient_in_cognifit(
                serializer.validated_data["patient_id"]
            )

            return Response(
                {
                    "patient_id": patient.id,
                    "cognifit_user_token": patient.cognifit_user_token,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as error:
            logger.exception("Erro ao registrar paciente na CogniFit")

            return Response(
                {
                    "error": str(error),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class CognifitGameStartView(generics.CreateAPIView):
    serializer_class = CognifitGameStartSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            data = get_cognifit_game_session(
                serializer.validated_data["patient_id"],
                serializer.validated_data["game_id"],
            )

            return Response(
                data,
                status=status.HTTP_200_OK,
            )

        except Exception as error:
            logger.exception("Erro ao iniciar jogo da CogniFit")

            return Response(
                {
                    "error": str(error),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )