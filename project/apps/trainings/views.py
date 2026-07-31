from rest_framework import generics

from apps.trainings.models import Training
from apps.trainings.serializers import TrainingSerializer


class TrainingListCreateView(generics.ListCreateAPIView):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer


class TrainingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer