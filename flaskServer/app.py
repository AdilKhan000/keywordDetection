from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400

    if file and file.filename.endswith((".wav", ".mp3", ".m4a", ".ogg")):
        # For testing, generate a random number or text as response
        response_message = f"Received file: {file.filename}."
        print("Successful")
        return jsonify({"message": response_message}), 200
        

    return jsonify({"message": "Invalid file format. Please upload an audio file."}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5000)
