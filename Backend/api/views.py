# ==============================================================================
# views.py - Fixed Views with Proper Class Structure
# ==============================================================================

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from .tasks import process_microscopy_image_micronet  # Celery task
from .models import DiagnosticSession, MicroscopyImage, Patient
from .serializers import (
    DiagnosticSessionSerializer,
    PatientSerializer,
    MicroscopyImageSerializer,
)
import logging

logger = logging.getLogger(__name__)


class DiagnosticSessionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing diagnostic sessions."""

    queryset = DiagnosticSession.objects.select_related(
        "patient", "technician"
    ).prefetch_related("images__aianalysisresult")
    serializer_class = DiagnosticSessionSerializer

    def perform_create(self, serializer):
        """Automatically set the technician to the logged-in user."""
        serializer.save(technician=self.request.user)

    @transaction.atomic
    @action(detail=True, methods=["post"])
    def upload_image(self, request, pk=None):
        """Upload microscopy image for AI analysis."""
        session = get_object_or_404(DiagnosticSession, pk=pk)

        if "image" not in request.FILES:
            return Response(
                {"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Create image record
        image = MicroscopyImage.objects.create(
        session=session,
        image=request.FILES["image"],
        image_metadata=request.data.get("metadata", {}),
        uploaded_by=request.user if request.user.is_authenticated else None,
    )

        # Trigger AI analysis asynchronously with MicroNet
        task_type = request.data.get("task_type", "classification")
        process_microscopy_image_micronet.delay(str(image.id), task_type)

        # Update session status
        session.status = "processing"
        session.save(update_fields=["status"])

        return Response(
            {
                "message": "Image uploaded successfully",
                "image_id": str(image.id),
                "status": "processing",
                "framework": "NASA_MicroNet",
                "task_type": task_type,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["get"])
    def results(self, request, pk=None):
        """Retrieve complete analysis results for a session."""
        session = get_object_or_404(
            DiagnosticSession.objects.prefetch_related("images__aianalysisresult"),
            pk=pk,
        )
        serializer = self.get_serializer(session)
        return Response(serializer.data)


class PatientViewSet(viewsets.ModelViewSet):
    """ViewSet for managing patients."""

    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
