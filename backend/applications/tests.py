
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
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

class LoginAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="login_user",
            password="TestPass123!",
        )
        self.url = "/api/auth/login/"

    def test_login_with_valid_credentials_creates_session(self):
        response = self.client.post(
            self.url,
            {
                "username": "login_user",
                "password": "TestPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "login_user")
        self.assertIn("_auth_user_id", self.client.session)

    def test_login_with_invalid_password_fails(self):
        response = self.client.post(
            self.url,
            {
                "username": "login_user",
                "password": "WrongPassword!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["detail"],
            "Invalid username or password.",
        )

    def test_login_without_credentials_fails(self):
        response = self.client.post(
            self.url,
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_session_login_allows_access_to_applications(self):
        response = self.client.post(
            self.url,
            {
                "username": "login_user",
                "password": "TestPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        applications_response = self.client.get("/api/applications/")

        self.assertEqual(
            applications_response.status_code,
            status.HTTP_200_OK,
        )


class LogoutAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="logout_user",
            password="TestPass123!",
        )
        self.login_url = "/api/auth/login/"
        self.logout_url = "/api/auth/logout/"
        self.applications_url = "/api/applications/"

    def test_authenticated_user_can_logout(self):
        self.client.force_login(self.user)

        response = self.client.post(self.logout_url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["detail"],
            "Logout successful.",
        )
        self.assertNotIn("_auth_user_id", self.client.session)

    def test_unauthenticated_user_cannot_logout(self):
        response = self.client.post(self.logout_url, format="json")

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_logged_out_user_cannot_access_applications(self):
        self.client.force_login(self.user)

        logout_response = self.client.post(
            self.logout_url,
            format="json",
        )

        self.assertEqual(
            logout_response.status_code,
            status.HTTP_200_OK,
        )

        applications_response = self.client.get(self.applications_url)

        self.assertEqual(
            applications_response.status_code,
            status.HTTP_403_FORBIDDEN,
        )


class CSRFProtectionTests(APITestCase):
    def setUp(self):
        self.client = APIClient(enforce_csrf_checks=True)
        self.user = User.objects.create_user(
            username="csrf_user",
            password="TestPass123!",
        )
        self.csrf_url = "/api/auth/csrf/"
        self.login_url = "/api/auth/login/"

    def test_csrf_endpoint_returns_token_and_cookie(self):
        response = self.client.get(self.csrf_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("csrfToken", response.data)
        self.assertIn("csrftoken", response.cookies)

    def test_login_without_csrf_token_is_rejected(self):
        response = self.client.post(
            self.login_url,
            {
                "username": "csrf_user",
                "password": "TestPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_login_with_valid_csrf_token_succeeds(self):
        csrf_response = self.client.get(self.csrf_url)
        csrf_token = csrf_response.data["csrfToken"]

        response = self.client.post(
            self.login_url,
            {
                "username": "csrf_user",
                "password": "TestPass123!",
            },
            format="json",
            HTTP_X_CSRFTOKEN=csrf_token,
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "csrf_user")
        self.assertIn("_auth_user_id", self.client.session)