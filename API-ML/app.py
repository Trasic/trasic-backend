import os
from flask import Flask, request, jsonify, json
from keras.models import load_model
from keras.preprocessing import image
import numpy as np
import tensorflow as tf
from tensorflow import keras
import tempfile
from firebase_admin import credentials, firestore, initialize_app
from google.cloud import storage

app = Flask(__name__)

labels = ['Angklung', 'Arumba', 'Calung', 'Jengglong','Kendang']
labels2 = ['Alat Musik', 'Random']
model = load_model("./Model.h5")
model2 = load_model("./Model2.h5")
# Firebase
cred = credentials.Certificate("./fbaccount.json")
initialize_app(cred)
db = firestore.client()
trasic_ref = db.collection('trasic_item')


# GCS
storage_client = storage.Client.from_service_account_json('./gcsaccount.json')
bucket_name = 'trasic-database'
bucket = storage_client.get_bucket(bucket_name)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

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

@app.route('/trasiclist', methods=['POST'])
def read_trasic():
    # read all trasic items
    docs = trasic_ref.stream()
    if docs:
        results = []
        for doc in docs:
            data = doc.to_dict()
            results.append(data)
        return jsonify(results)
    else:
        return jsonify({'message': 'Document not found'})
    
@app.route('/trasicone', methods=['POST'])
def read_trasic_one():
    #red one of trasic item based on id
    field_id = request.form.get('field_id')
    
    try:
        field_id = int(field_id)
    except ValueError:
        return jsonify({'message': 'Parameter must Integer'})
    
    if field_id:
        query = trasic_ref.where('id', '==', field_id).limit(1)
        docs = query.stream()

        result = []
        for doc in docs:
            result = doc.to_dict()
            break

        if result:
            return jsonify(result)
        else:
            return jsonify({'message': 'Document not found'})
    else :
        return jsonify({'message': 'Parameter not found'})

if __name__ == '__main__':
    app.run(port=int(os.environ.get("PORT", 8080)), host='0.0.0.0', debug=True)