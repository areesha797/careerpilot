
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated

from .models import JobApplication
from .serializers import JobApplicationSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

from .keyword_extractor import extract_keywords


class JobApplicationListCreateView(generics.ListCreateAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class JobApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)

class JobDescriptionKeywordExtractionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        description = request.data.get("description")

        if not isinstance(description, str) or not description.strip():
            return Response(
                {"detail": "A job description is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(description) > 20000:
            return Response(
                {"detail": "Job description cannot exceed 20,000 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = extract_keywords(description.strip())

        return Response(result, status=status.HTTP_200_OK)