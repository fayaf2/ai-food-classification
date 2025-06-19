import torch
import torchvision.transforms as transforms
from PIL import Image
import timm

# Load Food-101 class names from local file
with open("classes.txt", "r") as f:
    class_names = f.read().splitlines()

# Load pre-trained EfficientNet-B0 (you can replace with your own trained model)
model = timm.create_model('efficientnet_b0', pretrained=True, num_classes=len(class_names))
model.eval()

# Image transformation
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

def predict_food(image_path):
    img = Image.open(image_path).convert('RGB')
    img_tensor = transform(img).unsqueeze(0)
    with torch.no_grad():
        output = model(img_tensor)
        _, predicted = torch.max(output, 1)
    return class_names[predicted.item()]
