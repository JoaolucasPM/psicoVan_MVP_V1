from apps.patients.models import Patient
from apps.patients.serializers import PatientsSerializer
from rest_framework import generics


class PatientsList(generics.ListCreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientsSerializer


class PatientsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientsSerializer