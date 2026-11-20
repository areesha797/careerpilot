
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

class SkillMatchingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        description = request.data.get("description")
        user_skills = request.data.get("skills")

        if not isinstance(description, str) or not description.strip():
            return Response(
                {"detail": "A job description is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not isinstance(user_skills, str) or not user_skills.strip():
            return Response(
                {"detail": "Your skills are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(description) > 20000:
            return Response(
                {"detail": "Job description cannot exceed 20,000 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(user_skills) > 5000:
            return Response(
                {"detail": "Your skills cannot exceed 5,000 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        required = extract_keywords(description.strip())["keywords"]
        available = extract_keywords(user_skills.strip())["keywords"]

        available_normalized = {skill.casefold() for skill in available}

        matched = [
            skill for skill in required
            if skill.casefold() in available_normalized
        ]

        missing = [
            skill for skill in required
            if skill.casefold() not in available_normalized
        ]

        total_required = len(required)
        percentage = (
            round(len(matched) / total_required * 100, 1)
            if total_required else 0.0
        )

        return Response(
            {
                "required_skills": required,
                "matched_skills": matched,
                "missing_skills": missing,
                "total_required": total_required,
                "total_matched": len(matched),
                "total_missing": len(missing),
                "match_percentage": percentage,
            },
            status=status.HTTP_200_OK,
        )