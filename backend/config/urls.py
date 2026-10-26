
from django.contrib import admin
from django.urls import include, path
from applications.auth_views import CSRFTokenView, LoginView, LogoutView
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", LoginView.as_view(), name="api-login"),
    path("api/applications/", include("applications.urls")),
    path("api/auth/csrf/", CSRFTokenView.as_view(), name="api-csrf"),
    path("api/auth/login/", LoginView.as_view(), name="api-login"),
    path("api/auth/logout/", LogoutView.as_view(), name="api-logout"),
]
