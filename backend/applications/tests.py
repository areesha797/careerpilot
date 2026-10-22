
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

    def create_application(self, user=None, **overrides):
        data = {
            "company_name": "Test Company",
            "job_title": "Software Engineer",
            "status": "applied",
        }
        data.update(overrides)

        return JobApplication.objects.create(
            user=user or self.user,
            **data,
        )

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
        self.create_application(
            user=self.user,
            company_name="My Company",
        )
        self.create_application(
            user=self.other_user,
            company_name="Other Company",
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
        self.create_application(
            company_name="Company One",
            job_title="Python Developer",
        )
        self.create_application(
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

    def test_authenticated_user_can_retrieve_application(self):
        application = self.create_application()
        self.client.force_authenticate(user=self.user)

        response = self.client.get(
            f"{self.url}{application.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(
            response.data["company_name"],
            "Test Company",
        )

    def test_unauthenticated_user_cannot_retrieve_application(self):
        application = self.create_application()

        response = self.client.get(
            f"{self.url}{application.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_authenticated_user_can_update_application(self):
        application = self.create_application()
        self.client.force_authenticate(user=self.user)

        response = self.client.patch(
            f"{self.url}{application.id}/",
            {"status": "interview"},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        application.refresh_from_db()
        self.assertEqual(application.status, "interview")

    def test_authenticated_user_can_delete_application(self):
        application = self.create_application()
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(
            f"{self.url}{application.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )
        self.assertFalse(
            JobApplication.objects.filter(id=application.id).exists()
        )

    def test_user_cannot_retrieve_another_users_application(self):
        application = self.create_application(user=self.other_user)
        self.client.force_authenticate(user=self.user)

        response = self.client.get(
            f"{self.url}{application.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_user_cannot_update_another_users_application(self):
        application = self.create_application(user=self.other_user)
        self.client.force_authenticate(user=self.user)

        response = self.client.patch(
            f"{self.url}{application.id}/",
            {"status": "rejected"},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

        application.refresh_from_db()
        self.assertEqual(application.status, "applied")

    def test_user_cannot_delete_another_users_application(self):
        application = self.create_application(user=self.other_user)
        self.client.force_authenticate(user=self.user)

        response = self.client.delete(
            f"{self.url}{application.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )
        self.assertTrue(
            JobApplication.objects.filter(id=application.id).exists()
        )
