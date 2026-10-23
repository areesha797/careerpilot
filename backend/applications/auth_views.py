
from django.contrib.auth import authenticate, login
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not isinstance(username, str) or not isinstance(password, str):
            return Response(
                {"detail": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not username.strip() or not password:
            return Response(
                {"detail": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(
            request=request,
            username=username,
            password=password,
        )

        if user is None:
            return Response(
                {"detail": "Invalid username or password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(request, user)

        return Response(
            {
                "detail": "Login successful.",
                "username": user.get_username(),
            },
            status=status.HTTP_200_OK,
        )
