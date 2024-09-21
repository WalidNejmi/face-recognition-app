from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import json
import os
from face_taker import create_directory, get_face_id, save_name
from face_train import getImagesAndLabels
from face_recognizer import recognize_face
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for testing

logging.basicConfig(level=logging.DEBUG)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/capture', methods=['POST'])
def capture_face():
    data = request.json
    face_name = data['name']
    image_data = data['image']

    # Decode base64 image
    image_data = base64.b64decode(image_data.split(',')[1])
    nparr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Create directory and get face_id
    directory = 'images'
    create_directory(directory)
    face_id = get_face_id(directory)

    # Save name
    save_name(face_id, face_name, 'names.json')

    # Save image
    filename = f'./images/Users-{face_id}-1.jpg'
    cv2.imwrite(filename, cv2.cvtColor(img, cv2.COLOR_BGR2GRAY))

    return jsonify({"message": "Face captured successfully"})

@app.route('/train', methods=['POST'])
def train_model():
    try:
        # Check OpenCV version and use appropriate method
        if cv2.__version__.startswith('3'):
            recognizer = cv2.face.LBPHFaceRecognizer_create()
        elif cv2.__version__.startswith('4'):
            recognizer = cv2.face.LBPHFaceRecognizer_create()
        else:
            # For other versions, try this
            recognizer = cv2.face_LBPHFaceRecognizer.create()
        
        faces, ids = getImagesAndLabels('./images/')
        recognizer.train(faces, np.array(ids))
        recognizer.write('trainer.yml')
        return jsonify({"message": "Model trained successfully"})
    except AttributeError:
        logging.error("OpenCV face module not found. Make sure opencv-contrib-python is installed.")
        return jsonify({"error": "OpenCV face module not found"}), 500
    except Exception as e:
        logging.error(f"Error in train_model: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/recognize', methods=['POST'])
def recognize():
    data = request.json
    image_data = data['image']

    # Decode base64 image
    image_data = base64.b64decode(image_data.split(',')[1])
    nparr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    name, confidence = recognize_face(img)
    return jsonify({"name": name, "confidence": confidence})

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Explicitly set the port to 5000