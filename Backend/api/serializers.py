# ==============================================================================
# serializers.py - DRF Serializers for API Data Transformation
# ==============================================================================

from rest_framework import serializers
from .models import (
    HealthFacility,
    MicroscopyImage,
    AIAnalysisResult,
    AIModelMetadata,
    DiagnosticSession,
    Patient,
)


class HealthFacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthFacility
        fields = ["id", "name", "location", "facility_type", "created_at"]
        read_only_fields = ["id", "created_at"]


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


# serializers.py
class PatientSerializer(serializers.ModelSerializer):
    facility = HealthFacilitySerializer()

    class Meta:
        model = Patient
        fields = ["id", "patient_id", "age", "gender", "facility", "created_at"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        facility_data = validated_data.pop("facility")
        # prevent duplicates; tweak matching to your needs
        facility, _ = HealthFacility.objects.get_or_create(
            name=facility_data["name"],
            location=facility_data.get("location", ""),
            defaults={"facility_type": facility_data.get("facility_type", "")},
        )
        # Optionally update facility_type if provided
        if facility_data.get("facility_type"):
            facility.facility_type = facility_data["facility_type"]
            facility.save()
        return Patient.objects.create(facility=facility, **validated_data)

    def update(self, instance, validated_data):
        facility_data = validated_data.pop("facility", None)
        if facility_data:
            # update existing related facility
            for attr, val in facility_data.items():
                setattr(instance.facility, attr, val)
            instance.facility.save()
        return super().update(instance, validated_data)


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
