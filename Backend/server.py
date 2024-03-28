from flask import Flask, request, jsonify
import json
from googleapiclient import discovery
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

def check_toxicity_api(sentence):
  API_KEY = 'AIzaSyAEDAWTjTM1pjCKlZ8DisniLXyCpJmlZkM'

  client = discovery.build(
    "commentanalyzer",
    "v1alpha1",
    developerKey=API_KEY,
    discoveryServiceUrl="https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1",
    static_discovery=False,
  )

  analyze_request = {
    'comment': { 'text': sentence },
    'requestedAttributes': {'TOXICITY': {}}
  }

  response = client.comments().analyze(body=analyze_request).execute()
  
  if (response["attributeScores"]["TOXICITY"]["summaryScore"]["value"] > 0.55):
    return True
  else:
    return False



@app.route('/removeToxic', methods=['POST'])
@cross_origin()
def check_for_toxicity():
    print("here")
    try:
        sentence = request.json['sentence_for_analysis']
        toxic_status = check_toxicity_api(sentence)
        if toxic_status:
          response_json = {'info': "Success", 'toxic': True}
          return jsonify(response_json)
        else:
          response_json = {'info': "Success", 'toxic': False}
          return jsonify(response_json)
    except Exception as e:
        response_json = {'info': e, 'error': True}
        return jsonify(response_json)


if __name__ == '__main__':
   app.run(host="localhost", port=8000)