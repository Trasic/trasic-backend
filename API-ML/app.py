import os
from flask import Flask, request, jsonify, json
from keras.models import load_model
from keras.preprocessing import image
import numpy as np
import tensorflow as tf
from tensorflow import keras
import tempfile

app = Flask(__name__)

labels = ['Angklung', 'Arumba', 'Calung', 'Jengglong','Kendang']
labels2 = ['Alat Musik', 'Random']
model = load_model("./Model.h5")
model2 = load_model("./Model2.h5")

@app.route("/predict", methods=['POST'])
def predict():
    if 'file' not in request.files:
        return 'No file part in the request'

    file = request.files['file']

    if file.filename == '':
        return 'No selected file'

    temp_file = tempfile.NamedTemporaryFile(delete=False)
    file.save(temp_file.name)

    image = tf.keras.preprocessing.image.load_img(temp_file.name, target_size=(150, 150))
    x = tf.keras.preprocessing.image.img_to_array(image)
    x = x / 255.0
    x = np.expand_dims(x, axis=0)
    images = np.vstack([x])

    pred = model2.predict(images)
    if(np.argmax(pred) == 1):
        response = {
        "message": "Bukan Alat Musik",
        "result": 0,
        "score" : 0
         }

        return jsonify(response) 

    pred = model.predict(images)

    preds = labels[np.argmax(pred)]

    score = np.round(np.max(pred), 3)

    temp_file.close()

    response = {
        "message": "success",
        "result": preds,
        "score" : score.tolist()
    }
    if score > 0.8 and score <= 1.0:
        return jsonify(response)
    else:
        return jsonify({"message": "Instrument not found"})

if __name__ == '__main__':
     app.run(port=int(os.environ.get("PORT", 8080)), host='0.0.0.0', debug=True)
    # app.run(host='0.0.0.0', PORT=8080,  debug=True)