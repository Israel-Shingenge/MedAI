# ==============================================================================
# urls.py
# ==============================================================================

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DiagnosticSessionViewSet, PatientViewSet
from .mobile_views import (
    mobile_upload_image_micronet,
    mobile_check_micronet_result,
    create_diagnostic_session,
    mobile_upload_image,  # Legacy
    mobile_check_result,  # Legacy
)

router = DefaultRouter()
router.register(r"sessions", DiagnosticSessionViewSet)
router.register(r"patients", PatientViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("api-auth/", include("rest_framework.urls")),
    # NASA MicroNet endpoints
    path(
        "mobile/upload-micronet/",
        mobile_upload_image_micronet,
        name="mobile_upload_micronet",
    ),
    path(
        "mobile/result-micronet/<uuid:image_id>/",
        mobile_check_micronet_result,
        name="mobile_result_micronet",
    ),
    path("mobile/create-session/", create_diagnostic_session, name="create_session"),
    # Legacy endpoints (for backward compatibility)
    path("mobile/upload-image/", mobile_upload_image, name="mobile_upload_image"),
    path(
        "mobile/check-result/<uuid:image_id>/",
        mobile_check_result,
        name="mobile_check_result",
    ),
]
