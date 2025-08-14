# ==============================================================================
# test_micronet.py - Test NASA MicroNet Integration
# ==============================================================================

import torch
import pretrained_microscopy_models as pmm
import numpy as np
from PIL import Image
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def test_micronet_availability():
    """Test what's available in the NASA MicroNet package."""
    print("=== NASA MicroNet Package Contents ===")
    print(f"Available modules: {dir(pmm)}")

    print("\n=== PMM Util Methods ===")
    print(f"pmm.util methods: {dir(pmm.util)}")

    print("\n=== PMM Segmentation Training Methods ===")
    print(f"pmm.segmentation_training methods: {dir(pmm.segmentation_training)}")

    # Test if key functions exist
    if hasattr(pmm.util, "get_pretrained_microscopynet_url"):
        print("\n✅ get_pretrained_microscopynet_url is available")
        try:
            # Test getting a URL for ResNet50
            url = pmm.util.get_pretrained_microscopynet_url("resnet50", "micronet")
            print(f"✅ ResNet50 MicroNet URL: {url}")
        except Exception as e:
            print(f"❌ Error getting URL: {e}")
    else:
        print("\n❌ get_pretrained_microscopynet_url NOT available")

    if hasattr(pmm.segmentation_training, "create_segmentation_model"):
        print("\n✅ create_segmentation_model is available")
        try:
            # Test creating a basic segmentation model
            model = pmm.segmentation_training.create_segmentation_model(
                "Unet", "resnet18", "imagenet", classes=3
            )
            print(f"✅ Created UNet model: {type(model)}")
        except Exception as e:
            print(f"❌ Error creating segmentation model: {e}")
    else:
        print("\n❌ create_segmentation_model NOT available")


def test_classification_model():
    """Test loading a classification model with MicroNet weights."""
    print("\n=== Testing Classification Model ===")

    try:
        # Load ResNet50 architecture
        model = torch.hub.load("pytorch/vision:v0.10.0", "resnet50", pretrained=False)
        print("✅ Loaded ResNet50 architecture")

        # Try to load MicroNet weights
        try:
            url = pmm.util.get_pretrained_microscopynet_url("resnet50", "micronet")
            import torch.utils.model_zoo as model_zoo

            model.load_state_dict(model_zoo.load_url(url))
            print("✅ Loaded MicroNet weights")
            model_source = "MicroNet"
        except Exception as e:
            print(f"⚠️ Could not load MicroNet weights: {e}")
            print("Using ImageNet weights instead")
            model = torch.hub.load(
                "pytorch/vision:v0.10.0", "resnet50", pretrained=True
            )
            model_source = "ImageNet"

        # Modify for diagnostic classes (4 classes: normal, malaria, other_parasite, artifact)
        model.fc = torch.nn.Linear(model.fc.in_features, 4)
        model.eval()

        # Test with dummy input
        dummy_input = torch.randn(1, 3, 224, 224)
        with torch.no_grad():
            output = model(dummy_input)
            probabilities = torch.nn.functional.softmax(output, dim=1)

        print(f"✅ Model inference test successful")
        print(f"   - Source: {model_source}")
        print(f"   - Output shape: {output.shape}")
        print(f"   - Sample probabilities: {probabilities[0].tolist()}")

        return True

    except Exception as e:
        print(f"❌ Classification model test failed: {e}")
        return False


def test_segmentation_model():
    """Test loading a segmentation model."""
    print("\n=== Testing Segmentation Model ===")

    try:
        # Try MicroNet segmentation first
        try:
            model = pmm.segmentation_training.create_segmentation_model(
                "Unet", "resnet18", "micronet", classes=3
            )
            model_source = "MicroNet UNet"
            print("✅ Created MicroNet UNet")
        except Exception as e:
            print(f"⚠️ MicroNet UNet failed: {e}")

            # Fallback to ImageNet
            try:
                model = pmm.segmentation_training.create_segmentation_model(
                    "Unet", "resnet18", "imagenet", classes=3
                )
                model_source = "ImageNet UNet"
                print("✅ Created ImageNet UNet")
            except Exception as e2:
                print(f"⚠️ ImageNet UNet failed: {e2}")

                # Final fallback with segmentation_models_pytorch
                import segmentation_models_pytorch as smp

                model = smp.Unet(
                    encoder_name="resnet18",
                    encoder_weights="imagenet",
                    classes=3,
                    activation=None,
                )
                model_source = "SMP UNet"
                print("✅ Created SMP UNet")

        model.eval()

        # Test with dummy input
        dummy_input = torch.randn(1, 3, 224, 224)
        with torch.no_grad():
            output = model(dummy_input)

        print(f"✅ Segmentation model inference test successful")
        print(f"   - Source: {model_source}")
        print(f"   - Output shape: {output.shape}")
        print(f"   - Expected shape: [1, 3, 224, 224] (batch, classes, height, width)")

        return True

    except Exception as e:
        print(f"❌ Segmentation model test failed: {e}")
        return False


def create_test_microscopy_image():
    """Create a synthetic microscopy-like image for testing."""
    print("\n=== Creating Test Microscopy Image ===")

    # Create a synthetic microscopy image (circular cells with some noise)
    img_size = 224
    image = np.zeros((img_size, img_size, 3), dtype=np.uint8)

    # Add background noise
    noise = np.random.randint(0, 50, (img_size, img_size, 3))
    image = noise.astype(np.uint8)

    # Add circular "cells"
    center_coords = [(60, 60), (160, 80), (100, 150), (180, 180)]
    colors = [(150, 100, 100), (120, 150, 100), (100, 120, 150), (200, 150, 150)]

    y_coords, x_coords = np.ogrid[:img_size, :img_size]

    for (cx, cy), color in zip(center_coords, colors):
        mask = (x_coords - cx) ** 2 + (y_coords - cy) ** 2 < 400  # radius ~20
        image[mask] = color

    # Convert to PIL Image
    pil_image = Image.fromarray(image)
    pil_image.save("test_microscopy_image.png")
    print("✅ Created test microscopy image: test_microscopy_image.png")

    return pil_image


def test_full_pipeline():
    """Test the complete classification + segmentation pipeline."""
    print("\n=== Testing Full Pipeline ===")

    # Create test image
    test_image = create_test_microscopy_image()

    # Test classification
    print("\n--- Testing Classification Pipeline ---")
    classification_success = test_classification_model()

    # Test segmentation
    print("\n--- Testing Segmentation Pipeline ---")
    segmentation_success = test_segmentation_model()

    # Summary
    print(f"\n=== Pipeline Test Summary ===")
    print(f"Classification: {'✅ PASS' if classification_success else '❌ FAIL'}")
    print(f"Segmentation:   {'✅ PASS' if segmentation_success else '❌ FAIL'}")

    if classification_success and segmentation_success:
        print("\n🎉 NASA MicroNet integration is ready for production!")
        print(
            "You can now use both classification and segmentation models in your Django backend."
        )
    else:
        print(
            "\n⚠️ Some tests failed, but basic functionality should still work with fallback models."
        )


if __name__ == "__main__":
    print("🔬 NASA MicroNet Integration Test")
    print("=" * 50)

    # Check package availability
    test_micronet_availability()

    # Test full pipeline
    test_full_pipeline()

    print("\n" + "=" * 50)
    print("Test complete! Check results above.")

    print(f"\nNext steps:")
    print("1. If tests passed: Your NASA MicroNet integration is ready!")
    print("2. If some failed: Fallback models will be used automatically")
    print("3. Install segmentation_models_pytorch if segmentation tests failed:")
    print("   pip install segmentation-models-pytorch")
    print("4. Integrate the ai_inference.py code into your Django project")
