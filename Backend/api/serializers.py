# ==============================================================================
# serializers.py - DRF Serializers for API Data Transformation
# ==============================================================================

from rest_framework import serializers
from .models import (
    MicroscopyImage,
    AIAnalysisResult,
    AIModelMetadata,
    DiagnosticSession,
    Patient,
)


class AIModelMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIModelMetadata
        fields = ["id", "name", "version", "description", "uploaded_at"]


class AIAnalysisResultSerializer(serializers.ModelSerializer):
    ai_model = AIModelMetadataSerializer(read_only=True)

    class Meta:
        model = AIAnalysisResult
        fields = [
            "prediction",
            "confidence_score",
            "confidence_level",
            "detection_regions",
            "processing_time",
            "raw_output",
            "created_at",
            "ai_model",
        ]


class MicroscopyImageSerializer(serializers.ModelSerializer):
    ai_result = AIAnalysisResultSerializer(source="aianalysisresult", read_only=True)

    class Meta:
        model = MicroscopyImage
        fields = [
            "id",
            "image",
            "image_metadata",
            "uploaded_at",
            "uploaded_by",
            "ai_result",
        ]
        read_only_fields = ["uploaded_at"]


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ["id", "patient_id", "age", "gender", "facility", "created_at"]


class DiagnosticSessionSerializer(serializers.ModelSerializer):
    images = MicroscopyImageSerializer(many=True, read_only=True)
    patient = PatientSerializer(read_only=True)

    class Meta:
        model = DiagnosticSession
        fields = [
            "id",
            "patient",
            "technician",
            "disease_type",
            "status",
            "created_at",
            "completed_at",
            "images",
        ]
