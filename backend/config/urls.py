
from django.contrib import admin
from django.urls import include, path
from applications.auth_views import LoginView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", LoginView.as_view(), name="api-login"),
    path("api/applications/", include("applications.urls")),
]
