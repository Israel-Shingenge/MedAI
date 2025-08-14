# ==============================================================================
# tasks.py - Celery Tasks with NASA MicroNet Integration
# ==============================================================================

from celery import shared_task
from django.utils import timezone
import time
import logging

logger = logging.getLogger(__name__)


@shared_task
def process_microscopy_image_micronet(image_id: str, task_type: str = "classification"):
    """
    Async task to process microscopy image with NASA MicroNet models.
    """
    try:
        from .models import MicroscopyImage, AIAnalysisResult, DiagnosticSession
        from .ai_inference import predict_image

        # Get image record
        image_obj = MicroscopyImage.objects.get(id=image_id)
        session = image_obj.session

        logger.info(f"Processing image {image_id} with MicroNet ({task_type})")

        # Determine disease type from session
        disease_type = getattr(session, "disease_type", "parasite")

        # Run AI prediction with MicroNet
        results = predict_image(disease_type, image_obj.image.path, task_type)

        # Determine confidence level
        confidence = results.get("confidence", 0.0)
        confidence_level = (
            "high" if confidence > 0.8 else "medium" if confidence > 0.6 else "low"
        )

        # Prepare metadata
        metadata = {
            "framework": "NASA_MicroNet",
            "encoder": results.get("encoder", "unknown"),
            "task_type": task_type,
            "detection_count": len(results.get("detection_regions", [])),
        }

        # Add task-specific metadata
        if task_type == "classification":
            metadata["all_probabilities"] = results.get("all_probabilities", {})
        else:  # segmentation
            metadata["class_percentages"] = results.get("class_percentages", {})
            metadata["abnormal_area_percentage"] = results.get(
                "abnormal_area_percentage", 0
            )

        # Save AI analysis result
        analysis_result = AIAnalysisResult.objects.create(
            image=image_obj,
            ai_model_version=results.get("model_version", "micronet_v1.1"),
            prediction=results.get("prediction", "Unknown"),
            confidence_score=confidence,
            confidence_level=confidence_level,
            detection_regions=results.get("detection_regions", []),
            processing_time=results.get("processing_time", 0.0),
            metadata=metadata,
        )

        # Update session status based on results
        if "Error" in results.get("prediction", ""):
            session.status = "failed"
        elif confidence_level == "low":
            session.status = "requires_review"
        else:
            session.status = "completed"
            session.completed_at = timezone.now()

        session.save()

        logger.info(
            f"Successfully processed image {image_id}: {results.get('prediction')}"
        )

        return {
            "status": "success",
            "image_id": image_id,
            "prediction": results.get("prediction"),
            "confidence": confidence,
            "task_type": task_type,
            "analysis_id": str(analysis_result.id),
        }

    except Exception as e:
        logger.error(f"Failed to process image {image_id}: {e}")

        try:
            # Update session status on error
            image_obj = MicroscopyImage.objects.get(id=image_id)
            session = image_obj.session
            session.status = "failed"
            session.save()
        except:
            pass

        return {"status": "error", "image_id": image_id, "error": str(e)}
