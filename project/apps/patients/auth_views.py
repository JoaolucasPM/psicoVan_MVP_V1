from django.contrib.auth.hashers import check_password

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.patients.models import Patient


class PatientLoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            patient = Patient.objects.get(email=email)
        except Patient.DoesNotExist:
            return Response(
                {"error": "E-mail ou senha inválidos."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not check_password(password, patient.password):
            return Response(
                {"error": "E-mail ou senha inválidos."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(
            {
                "id": patient.id,
                "first_name": patient.first_name,
                "last_name": patient.last_name,
                "email": patient.email,
            }
        )