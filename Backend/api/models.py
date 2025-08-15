from django.db import models
import uuid


# ------------------------
# Facility Model
# ------------------------
class HealthFacility(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    facility_type = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ------------------------
# Patient
# ------------------------
class Patient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient_id = models.CharField(max_length=50, unique=True)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10, choices=[("M", "Male"), ("F", "Female")])
    facility = models.ForeignKey(
        HealthFacility, on_delete=models.CASCADE, related_name="patients"
    )
    created_at = models.DateTimeField(auto_now_add=True)


# ------------------------
# Diagnostic Session
# ------------------------
class DiagnosticSession(models.Model):
    DISEASE_TYPES = [
        ("tuberculosis", "Tuberculosis"),
        ("parasites", "Parasitic Infections"),
        ("schistosomiasis", "Schistosomiasis"),
        ("fungal", "Fungal Infections"),
        ("blood_abnormalities", "Blood Cell Abnormalities"),
    ]
    STATUS_CHOICES = [
        ("pending", "Pending Analysis"),
        ("processing", "Processing"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("requires_review", "Requires Expert Review"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(
        Patient, on_delete=models.CASCADE, related_name="sessions"
    )
    technician_name = models.CharField(max_length=255, blank=True, null=True)
    disease_type = models.CharField(max_length=50, choices=DISEASE_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)


# ------------------------
# Microscopy Image
# ------------------------
class MicroscopyImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(
        DiagnosticSession, related_name="images", on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="microscopy_images/")
    image_metadata = models.JSONField(default=dict)
    uploaded_by_name = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)


# ------------------------
# AI Model Metadata
# ------------------------
class AIModelMetadata(models.Model):
    name = models.CharField(max_length=100)
    version = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to="ai_models/")

    def __str__(self):
        return f"{self.name} v{self.version}"


# ------------------------
# AI Analysis Result
# ------------------------
class AIAnalysisResult(models.Model):
    CONFIDENCE_LEVELS = [
        ("high", "High (>90%)"),
        ("medium", "Medium (70-90%)"),
        ("low", "Low (<70%)"),
    ]

    image = models.OneToOneField(MicroscopyImage, on_delete=models.CASCADE)
    ai_model = models.ForeignKey(
        AIModelMetadata, on_delete=models.SET_NULL, null=True, blank=True
    )
    prediction = models.CharField(max_length=100)
    confidence_score = models.FloatField()
    confidence_level = models.CharField(max_length=10, choices=CONFIDENCE_LEVELS)
    detection_regions = models.JSONField(default=list)
    processing_time = models.FloatField()
    raw_output = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.confidence_score >= 0.9:
            self.confidence_level = "high"
        elif self.confidence_score >= 0.7:
            self.confidence_level = "medium"
        else:
            self.confidence_level = "low"
        super().save(*args, **kwargs)


# ------------------------
# Expert Review
# ------------------------
class ExpertReview(models.Model):
    analysis = models.OneToOneField(AIAnalysisResult, on_delete=models.CASCADE)
    reviewer_name = models.CharField(max_length=255, blank=True, null=True)
    expert_diagnosis = models.TextField()
    agrees_with_ai = models.BooleanField()
    notes = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(auto_now_add=True)
