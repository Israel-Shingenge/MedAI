# ==============================================================================
# ai_inference.py - NASA MicroNet Integration for Microscopy Diagnostics
# ==============================================================================

import torch
import torch.nn as nn
import cv2
import numpy as np
from PIL import Image
import torchvision.transforms as transforms
from pathlib import Path
import logging
from typing import Dict, List, Tuple, Any
import time
import pretrained_microscopy_models as pmm
import torch.utils.model_zoo as model_zoo

logger = logging.getLogger(__name__)


class MicroscopyModelManager:
    """
    Manages NASA MicroNet models for microscopy image analysis.
    Supports both classification and segmentation tasks.
    """

    def __init__(self):
        self.models = {}
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"NASA MicroNet models will run on: {self.device}")

        # Image preprocessing pipeline for microscopy
        self.transform = transforms.Compose(
            [
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]
                ),
            ]
        )

    def load_micronet_classifier(self, encoder_name: str = "resnet50"):
        """Load MicroNet pretrained classification model."""
        try:
            # Test available methods first
            logger.info(f"Available pmm.util methods: {dir(pmm.util)}")

            # Load base model architecture
            model = torch.hub.load(
                "pytorch/vision:v0.10.0", encoder_name, pretrained=False
            )

            # Try to load MicroNet pretrained weights
            try:
                url = pmm.util.get_pretrained_microscopynet_url(
                    encoder_name, "micronet"
                )
                model.load_state_dict(model_zoo.load_url(url))
                logger.info(f"Successfully loaded MicroNet weights for {encoder_name}")
            except Exception as weight_error:
                logger.warning(f"Could not load MicroNet weights: {weight_error}")
                logger.info("Falling back to ImageNet pretrained weights")
                model = torch.hub.load(
                    "pytorch/vision:v0.10.0", encoder_name, pretrained=True
                )

            # Modify classifier head for diagnostic classes
            num_classes = self.get_num_classes()
            if hasattr(model, "fc"):
                model.fc = nn.Linear(model.fc.in_features, num_classes)
            elif hasattr(model, "classifier"):
                if isinstance(model.classifier, nn.Sequential):
                    model.classifier[-1] = nn.Linear(
                        model.classifier[-1].in_features, num_classes
                    )
                else:
                    model.classifier = nn.Linear(
                        model.classifier.in_features, num_classes
                    )

            model = model.to(self.device)
            model.eval()

            logger.info(f"Loaded classification model with {encoder_name} backbone")
            return model

        except Exception as e:
            logger.error(f"Failed to load classifier {encoder_name}: {e}")
            # Fallback to simple ResNet
            logger.info("Using fallback ResNet18 model")
            model = torch.hub.load(
                "pytorch/vision:v0.10.0", "resnet18", pretrained=True
            )
            model.fc = nn.Linear(model.fc.in_features, self.get_num_classes())
            model = model.to(self.device)
            model.eval()
            return model

    def load_micronet_segmentation(
        self, encoder_name: str = "resnet50", num_classes: int = 3
    ):
        """Load MicroNet pretrained segmentation model."""
        try:
            # Check available segmentation methods
            logger.info(
                f"Available segmentation_training methods: {dir(pmm.segmentation_training)}"
            )

            # Try to create UNet with MicroNet backbone
            try:
                model = pmm.segmentation_training.create_segmentation_model(
                    "Unet", encoder_name, "micronet", classes=num_classes
                )
                logger.info(f"Successfully created MicroNet UNet with {encoder_name}")
            except Exception as seg_error:
                logger.warning(
                    f"Could not create MicroNet segmentation model: {seg_error}"
                )
                logger.info("Creating basic segmentation model with ImageNet backbone")

                # Fallback: create basic UNet with ImageNet backbone
                try:
                    model = pmm.segmentation_training.create_segmentation_model(
                        "Unet", encoder_name, "imagenet", classes=num_classes
                    )
                except Exception as fallback_error:
                    logger.error(f"Fallback segmentation failed: {fallback_error}")
                    # Use a simple segmentation model
                    import segmentation_models_pytorch as smp

                    model = smp.Unet(
                        encoder_name=encoder_name,
                        encoder_weights="imagenet",
                        classes=num_classes,
                        activation=None,
                    )

            model = model.to(self.device)
            model.eval()

            logger.info(f"Loaded segmentation model with {encoder_name} backbone")
            return model

        except Exception as e:
            logger.error(f"Failed to load segmentation model: {e}")
            # Final fallback - basic UNet
            try:
                import segmentation_models_pytorch as smp

                model = smp.Unet(
                    encoder_name="resnet18",
                    encoder_weights="imagenet",
                    classes=num_classes,
                    activation=None,
                )
                model = model.to(self.device)
                model.eval()
                logger.info("Using fallback ResNet18 UNet")
                return model
            except Exception as final_error:
                logger.error(f"All segmentation model loading failed: {final_error}")
                raise

    def get_num_classes(self):
        """Get number of classes for classification."""
        # Customize based on your diagnostic categories
        return 4  # e.g., normal, malaria, other_parasite, artifact

    def load_model(self, disease_type: str, task_type: str = "classification"):
        """Load appropriate MicroNet model based on disease type and task."""
        model_key = f"{disease_type}_{task_type}"

        if model_key not in self.models:
            config = self.get_model_config(disease_type, task_type)

            if task_type == "classification":
                model = self.load_micronet_classifier(config["encoder"])
            else:  # segmentation
                model = self.load_micronet_segmentation(
                    config["encoder"], config["num_classes"]
                )

            self.models[model_key] = {
                "model": model,
                "config": config,
                "task_type": task_type,
            }

        return self.models[model_key]

    def get_model_config(self, disease_type: str, task_type: str) -> Dict[str, Any]:
        """Get model configuration for specific disease type and task."""
        configs = {
            "malaria_classification": {
                "encoder": "efficientnet-b2",  # Good accuracy/speed balance
                "num_classes": 3,  # normal, infected, suspicious
                "confidence_threshold": 0.7,
                "class_names": ["Normal", "Malaria_Infected", "Suspicious"],
                "version": "micronet_v1.1",
            },
            "malaria_segmentation": {
                "encoder": "resnet50",
                "num_classes": 3,  # background, cell, parasite
                "confidence_threshold": 0.6,
                "class_names": ["Background", "Blood_Cell", "Parasite"],
                "version": "micronet_v1.1",
            },
            "parasite_classification": {
                "encoder": "se_resnext50_32x4d",  # High accuracy for parasites
                "num_classes": 4,  # normal, malaria, other_parasite, artifact
                "confidence_threshold": 0.75,
                "class_names": ["Normal", "Malaria", "Other_Parasite", "Artifact"],
                "version": "micronet_v1.1",
            },
            "general_segmentation": {
                "encoder": "efficientnet-b1",
                "num_classes": 2,  # background, abnormal_region
                "confidence_threshold": 0.5,
                "class_names": ["Background", "Abnormal_Region"],
                "version": "micronet_v1.1",
            },
        }

        key = f"{disease_type}_{task_type}"
        return configs.get(key, configs["parasite_classification"])

    def predict_classification(
        self, model_info: Dict, image_path: str
    ) -> Dict[str, Any]:
        """Run classification inference on microscopy image."""
        try:
            # Load and preprocess image
            image = Image.open(image_path).convert("RGB")
            input_tensor = self.transform(image).unsqueeze(0).to(self.device)

            # Run inference
            with torch.no_grad():
                outputs = model_info["model"](input_tensor)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)
                confidence, predicted = torch.max(probabilities, 1)

            config = model_info["config"]
            class_names = config.get(
                "class_names", [f"Class_{i}" for i in range(config["num_classes"])]
            )

            predicted_class = class_names[predicted.item()]
            confidence_score = confidence.item()

            # Get all class probabilities
            all_probs = probabilities[0].cpu().numpy()
            class_probabilities = {
                class_names[i]: float(all_probs[i]) for i in range(len(class_names))
            }

            return {
                "prediction": predicted_class,
                "confidence": round(confidence_score, 3),
                "all_probabilities": class_probabilities,
                "detection_regions": [],  # Classification doesn't provide regions
                "task_type": "classification",
            }

        except Exception as e:
            logger.error(f"Classification prediction failed: {e}")
            raise

    def predict_segmentation(self, model_info: Dict, image_path: str) -> Dict[str, Any]:
        """Run segmentation inference on microscopy image."""
        try:
            # Load and preprocess image
            image = cv2.imread(image_path)
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            original_size = image_rgb.shape[:2]

            # Resize for model
            image_resized = cv2.resize(image_rgb, (224, 224))
            image_pil = Image.fromarray(image_resized)
            input_tensor = self.transform(image_pil).unsqueeze(0).to(self.device)

            # Run inference
            with torch.no_grad():
                outputs = model_info["model"](input_tensor)
                predicted_mask = torch.argmax(outputs, dim=1).squeeze(0).cpu().numpy()

            # Resize mask back to original size
            predicted_mask = cv2.resize(
                predicted_mask.astype(np.uint8),
                (original_size[1], original_size[0]),
                interpolation=cv2.INTER_NEAREST,
            )

            # Analyze segmentation results
            analysis = self.analyze_segmentation_mask(
                predicted_mask, model_info["config"]
            )

            return analysis

        except Exception as e:
            logger.error(f"Segmentation prediction failed: {e}")
            raise

    def analyze_segmentation_mask(
        self, mask: np.ndarray, config: Dict
    ) -> Dict[str, Any]:
        """Analyze segmentation mask to extract diagnostic information."""
        try:
            class_names = config.get(
                "class_names", [f"Class_{i}" for i in range(config["num_classes"])]
            )

            # Count pixels for each class
            unique_classes, counts = np.unique(mask, return_counts=True)
            total_pixels = mask.size

            class_percentages = {}
            detection_regions = []

            for class_id, count in zip(unique_classes, counts):
                if class_id < len(class_names):
                    class_name = class_names[class_id]
                    percentage = (count / total_pixels) * 100
                    class_percentages[class_name] = round(percentage, 2)

                    # Find bounding boxes for non-background classes
                    if class_id > 0:  # Skip background
                        contours, _ = cv2.findContours(
                            (mask == class_id).astype(np.uint8),
                            cv2.RETR_EXTERNAL,
                            cv2.CHAIN_APPROX_SIMPLE,
                        )

                        for contour in contours:
                            if cv2.contourArea(contour) > 100:  # Filter small regions
                                x, y, w, h = cv2.boundingRect(contour)
                                detection_regions.append([x, y, x + w, y + h])

            # Determine overall prediction
            max_abnormal_class = None
            max_abnormal_percentage = 0

            for class_name, percentage in class_percentages.items():
                if class_name != "Background" and percentage > max_abnormal_percentage:
                    max_abnormal_percentage = percentage
                    max_abnormal_class = class_name

            if max_abnormal_percentage > 5:  # Threshold for detection
                prediction = f"{max_abnormal_class} Detected"
                confidence = min(max_abnormal_percentage / 20, 1.0)  # Scale to 0-1
            else:
                prediction = "Normal"
                confidence = 1.0 - (max_abnormal_percentage / 20)

            return {
                "prediction": prediction,
                "confidence": round(confidence, 3),
                "class_percentages": class_percentages,
                "detection_regions": detection_regions,
                "abnormal_area_percentage": max_abnormal_percentage,
                "task_type": "segmentation",
            }

        except Exception as e:
            logger.error(f"Mask analysis failed: {e}")
            return {
                "prediction": "Analysis Failed",
                "confidence": 0.0,
                "error": str(e),
                "task_type": "segmentation",
            }

    def predict_image(
        self, disease_type: str, image_path: str, task_type: str = "classification"
    ) -> Dict[str, Any]:
        """
        Main prediction function for microscopy images.
        Supports both classification and segmentation tasks.
        """
        try:
            start_time = time.time()

            # Load model
            model_info = self.load_model(disease_type, task_type)

            # Run appropriate prediction
            if task_type == "classification":
                results = self.predict_classification(model_info, image_path)
            else:
                results = self.predict_segmentation(model_info, image_path)

            # Add metadata
            processing_time = time.time() - start_time
            results.update(
                {
                    "processing_time": round(processing_time, 3),
                    "model_version": model_info["config"]["version"],
                    "encoder": model_info["config"]["encoder"],
                    "framework": "NASA_MicroNet",
                }
            )

            return results

        except Exception as e:
            logger.error(f"Prediction failed for {disease_type}: {e}")
            return {
                "prediction": "Error",
                "confidence": 0.0,
                "error": str(e),
                "detection_regions": [],
                "processing_time": 0.0,
                "framework": "NASA_MicroNet",
            }


# Global model manager instance
microscopy_model_manager = MicroscopyModelManager()


def predict_image(
    disease_type: str, image_path: str, task_type: str = "classification"
) -> Dict[str, Any]:
    """Main prediction function for external use."""
    return microscopy_model_manager.predict_image(disease_type, image_path, task_type)
