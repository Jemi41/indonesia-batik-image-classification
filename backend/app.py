import os
import io
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS 
from tensorflow.keras.preprocessing import image

# 1. Initialize the Flask App
app = Flask(__name__)
CORS(app) 

# 2. Load the Model (ensure the filename matches your .h5 file)
MODEL_PATH = 'batik_expert_model.h5'
model = tf.keras.models.load_model(MODEL_PATH)

# 3. Full List of Motif Classes
class_names = ['batik-bali', 'batik-betawi', 'batik-celup', 'batik-cendrawasih', 
               'batik-ceplok', 'batik-ciamis', 'batik-garutan', 'batik-gentongan', 
               'batik-kawung', 'batik-keraton', 'batik-lasem', 'batik-megamendung', 
               'batik-parang', 'batik-pekalongan', 'batik-priangan', 'batik-sekar', 
               'batik-sidoluhur', 'batik-sidomukti', 'batik-sogan', 'batik-tambal']

# 4. The Prediction Logic
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    
    # Preprocess image
    img_bytes = io.BytesIO(file.read())
    img = image.load_img(img_bytes, target_size=(224, 224))
    
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0

    # Prediction
    predictions = model.predict(img_array)
    predicted_index = np.argmax(predictions)
    predicted_class = class_names[predicted_index]
    confidence = np.max(predictions) * 100

    return jsonify({
        "motif": predicted_class,
        "confidence": float(confidence)
    })

# 5. Run the Server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)