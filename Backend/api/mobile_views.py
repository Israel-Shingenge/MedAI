# ==============================================================================
# mobile_views.py - Fixed Mobile API Views for NASA MicroNet
# ==============================================================================

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
import uuid
import logging

# Import your models - adjust import path as needed
from .models import DiagnosticSession, MicroscopyImage, AIAnalysisResult
from .tasks import process_microscopy_image_micronet

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mobile_upload_image_micronet(request):
    """Upload microscopy image and trigger MicroNet AI processing."""
    try:
        session_id = request.data.get("session_id")
        task_type = request.data.get("task_type", "classification")  # or 'segmentation'

        if not session_id:
            return Response(
                {"error": "session_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        if task_type not in ["classification", "segmentation"]:
            return Response(
                {"error": 'task_type must be "classification" or "segmentation"'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        session = get_object_or_404(DiagnosticSession, pk=session_id)

        if "image" not in request.FILES:
            return Response(
                {"error": "No image file provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Validate image file
        image_file = request.FILES["image"]
        if not image_file.content_type.startswith("image/"):
            return Response(
                {"error": "Invalid file type. Please upload an image."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create image record
        image = MicroscopyImage.objects.create(
            session=session,
            image=image_file,
            uploaded_by=request.user,
            image_metadata={
                "uploaded_via": "mobile_app_micronet",
                "task_type": task_type,
                "camera_settings": request.data.get("camera_settings", {}),
                "file_size": image_file.size,
                "content_type": image_file.content_type,
            },
        )

        logger.info(f"Image {image.id} uploaded for MicroNet {task_type}")

        # Trigger async MicroNet processing
        task = process_microscopy_image_micronet.delay(str(image.id), task_type)

        return Response(
            {
                "success": True,
                "image_id": str(image.id),
                "task_id": task.id,
                "task_type": task_type,
                "message": f"Image uploaded successfully, MicroNet {task_type} processing started",
                "estimated_processing_time": "15-45 seconds",
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        logger.error(f"Failed to upload image for MicroNet: {e}")
        return Response(
            {"error": "Failed to process upload"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mobile_check_micronet_result(request, image_id):
    """Check MicroNet processing status and results."""
    try:
        image = get_object_or_404(MicroscopyImage, pk=image_id)

        try:
            result = image.aianalysisresult
            response_data = {
                "status": "completed",
                "result": {
                    "prediction": result.prediction,
                    "confidence": result.confidence_score,
                    "confidence_level": result.confidence_level,
                    "processing_time": result.processing_time,
                    "detection_regions": result.detection_regions,
                    "framework": (
                        result.metadata.get("framework", "NASA_MicroNet")
                        if result.metadata
                        else "NASA_MicroNet"
                    ),
                    "encoder": (
                        result.metadata.get("encoder", "unknown")
                        if result.metadata
                        else "unknown"
                    ),
                    "task_type": (
                        result.metadata.get("task_type", "classification")
                        if result.metadata
                        else "classification"
                    ),
                    "analysis_timestamp": result.created_at.isoformat(),
                },
            }

            # Add task-specific results
            if result.metadata and result.metadata.get("task_type") == "classification":
                response_data["result"]["all_probabilities"] = result.metadata.get(
                    "all_probabilities", {}
                )
            elif result.metadata and result.metadata.get("task_type") == "segmentation":
                response_data["result"]["class_percentages"] = result.metadata.get(
                    "class_percentages", {}
                )
                response_data["result"]["abnormal_area_percentage"] = (
                    result.metadata.get("abnormal_area_percentage", 0)
                )

            return Response(response_data)

        except AIAnalysisResult.DoesNotExist:
            # Check if processing failed
            if image.session.status == "failed":
                return Response(
                    {
                        "status": "failed",
                        "message": "MicroNet processing failed. Please try uploading again.",
                    }
                )
            else:
                return Response(
                    {
                        "status": "processing",
                        "message": "MicroNet analysis is still in progress",
                    }
                )

    except Exception as e:
        logger.error(f"Failed to check MicroNet result for image {image_id}: {e}")
        return Response(
            {"error": "Failed to retrieve result"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_diagnostic_session(request):
    """Create a new diagnostic session."""
    try:
        patient_id = request.data.get("patient_id")
        disease_type = request.data.get("disease_type", "malaria")

        if not patient_id:
            return Response(
                {"error": "patient_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Create or get patient
        from .models import Patient

        try:
            patient = Patient.objects.get(patient_id=patient_id)
        except Patient.DoesNotExist:
            patient = Patient.objects.create(
                patient_id=patient_id,
                age=request.data.get("age", 0),
                gender=request.data.get("gender", "unknown"),
            )

        # Create diagnostic session
        session = DiagnosticSession.objects.create(
            patient=patient,
            technician=request.user,
            disease_type=disease_type,
            status="active",
        )

        return Response(
            {
                "success": True,
                "session_id": str(session.id),
                "patient_id": patient_id,
                "disease_type": disease_type,
                "status": "active",
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        logger.error(f"Failed to create session: {e}")
        return Response(
            {"error": "Failed to create diagnostic session"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# Legacy functions for backward compatibility
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mobile_upload_image(request):
    """Legacy upload - redirects to MicroNet version."""
    return mobile_upload_image_micronet(request)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mobile_check_result(request, image_id):
    """Legacy result check - redirects to MicroNet version."""
    return mobile_check_micronet_result(request, image_id)
