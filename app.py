from flask import Flask, request, jsonify
import base64
from ultralytics import YOLO
from datetime import datetime
app = Flask(__name__)

@app.route('/')
def Index():
    return f'Hello World, time: {datetime.now()}'

@app.route('/processImage', methods=['POST'])
def uploadImage():
    image_file = request.json.get("imageFile")
    print(f'image_file : {image_file}')
    return jsonify(request.json)

# @app.route('/process/createModel', methods=['POST'])
# def createModel():
#     try:
#         weight = request.json.get("weightFile")
#         image = request.get_json()
#         # print(f"weight : {weight}")
#         # result = {"result": weight}
#         # return jsonify(result)
#         return jsonify({'message': 'Processed result received successfully'})
#     except Exception as e:
#         raise e


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)