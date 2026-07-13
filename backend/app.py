from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf

app = Flask(__name__)
CORS(app)

# 🔥 Recreate architecture explicitly so it avoids ANY Keras 3 -> 2 json metadata bugs
def create_model():
    inputs = tf.keras.Input(shape=(23, 4))
    x = tf.keras.layers.Conv1D(64, 3, strides=1, padding='valid', activation='relu')(inputs)
    x = tf.keras.layers.MaxPooling1D(pool_size=2, strides=2, padding='valid')(x)
    x = tf.keras.layers.Conv1D(128, 3, strides=1, padding='valid', activation='relu')(x)
    x = tf.keras.layers.Attention()([x, x])
    x = tf.keras.layers.Flatten()(x)
    x = tf.keras.layers.Dense(256, activation='relu')(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    outputs = tf.keras.layers.Dense(1, activation='linear')(x)
    return tf.keras.Model(inputs=inputs, outputs=outputs)

model = create_model()
model.load_weights("crispr_activity_model.h5", by_name=True)

# Preprocess function
def preprocess(sequence):
    sequence = sequence.upper()
    mapping = {'A': 0, 'C': 1, 'G': 2, 'T': 3}
    
    # Create one-hot encoding matrix (23 steps, 4 features)
    encoded = np.zeros((23, 4), dtype=np.float32)
    
    for i, c in enumerate(sequence[:23]):
        if c in mapping:
            encoded[i, mapping[c]] = 1.0
            
    return np.array([encoded])

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    sequence = data.get("sequence")

    if not sequence:
        return jsonify({"error": "No sequence provided"}), 400

    processed = preprocess(sequence)

    prediction = model.predict(processed)

    score = float(prediction[0][0])

    return jsonify({"score": score})

@app.route("/predict_batch", methods=["POST"])
def predict_batch():
    data = request.json
    sequences = data.get("sequences")

    if not sequences or not isinstance(sequences, list):
        return jsonify({"error": "No sequences provided"}), 400

    processed_list = []
    valid_sequences = []
    for seq in sequences:
        if isinstance(seq, str) and len(seq) == 23:
            # preprocess returns shape (1, 23, 4), we just want (23, 4)
            processed_list.append(preprocess(seq)[0])
            valid_sequences.append(seq)

    if not processed_list:
        return jsonify({"error": "No valid 23-character sequences"}), 400

    processed_array = np.array(processed_list)
    predictions = model.predict(processed_array)

    results = []
    for i, seq in enumerate(valid_sequences):
        score = float(predictions[i][0])
        # Match percentage formatting on backend or frontend
        # The single predict scales it if <= 1.0 on front-end, let's just return raw and calculate on frontend
        results.append({
            "sequence": seq,
            "score": score
        })

    # Sort descending based on score
    results = sorted(results, key=lambda x: x["score"], reverse=True)

    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)