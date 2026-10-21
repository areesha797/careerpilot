
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import JobApplication


User = get_user_model()


class JobApplicationAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="test_user",
            password="TestPass123!",
        )
        self.other_user = User.objects.create_user(
            username="other_user",
            password="TestPass123!",
        )
        self.url = "/api/applications/"

        self.payload = {
            "company_name": "Test Company",
            "job_title": "Software Engineer",
            "status": "applied",
        }

    def test_unauthenticated_user_cannot_access_applications(self):
        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_authenticated_user_can_create_application(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            self.url,
            self.payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertEqual(
            response.data["company_name"],
            "Test Company",
        )

    def test_new_application_is_assigned_to_logged_in_user(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            self.url,
            self.payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        application = JobApplication.objects.get(
            id=response.data["id"]
        )
        self.assertEqual(application.user, self.user)

    def test_user_can_only_see_own_applications(self):
        JobApplication.objects.create(
            user=self.user,
            company_name="My Company",
            job_title="Python Developer",
            status="applied",
        )
        JobApplication.objects.create(
            user=self.other_user,
            company_name="Other Company",
            job_title="Frontend Developer",
            status="interview",
        )

        self.client.force_authenticate(user=self.user)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]["company_name"],
            "My Company",
        )

    def test_authenticated_user_can_list_own_applications(self):
        JobApplication.objects.create(
            user=self.user,
            company_name="Company One",
            job_title="Python Developer",
            status="applied",
        )
        JobApplication.objects.create(
            user=self.user,
            company_name="Company Two",
            job_title="Backend Developer",
            status="interview",
        )

        self.client.force_authenticate(user=self.user)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(len(response.data), 2)
        self.assertEqual(
            {item["company_name"] for item in response.data},
            {"Company One", "Company Two"},
        )
