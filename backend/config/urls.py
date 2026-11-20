
from django.contrib import admin
from django.urls import include, path
from applications.views import (
    JobDescriptionKeywordExtractionView,
    SkillMatchingView,
)

from applications.auth_views import (
    CSRFTokenView,
    CurrentUserView,
    LoginView,
    LogoutView,
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/csrf/", CSRFTokenView.as_view(), name="api-csrf"),
    path("api/auth/login/", LoginView.as_view(), name="api-login"),
    path("api/auth/logout/", LogoutView.as_view(), name="api-logout"),
    path("api/auth/me/", CurrentUserView.as_view(), name="api-current-user"),
    path("api/applications/", include("applications.urls")),
    path(
    "api/keywords/extract/",
    JobDescriptionKeywordExtractionView.as_view(),
    name="keyword-extraction",
),
   path(
    "api/keywords/match/",
    SkillMatchingView.as_view(),
    name="skill-matching",
),
]
