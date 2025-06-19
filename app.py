from flask import Flask, render_template, request, jsonify
import os
import base64
from datetime import datetime
from food_model import predict_food

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload():
    data = request.json['image']
    header, encoded = data.split(",", 1)
    img_bytes = base64.b64decode(encoded)

    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}.jpg"
    image_path = os.path.join(UPLOAD_FOLDER, filename)

    with open(image_path, 'wb') as f:
        f.write(img_bytes)

    try:
        result = predict_food(image_path)
        return jsonify({"success": True, "message": f"Detected food: {result}"})
    except Exception as e:
        return jsonify({"success": False, "message": f"Error: {str(e)}"})


if __name__ == '__main__':
    app.run(debug=True)
