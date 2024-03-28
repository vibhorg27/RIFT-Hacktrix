from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from googleapiclient import discovery
from pydantic import BaseModel


class Item(BaseModel):
    sentence_for_analysis: str

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
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
  
  if (response["attributeScores"]["TOXICITY"]["summaryScore"]["value"] > 0.4):
    print(response["attributeScores"]["TOXICITY"]["summaryScore"]["value"], sentence)
    return True
  else:
    return False
  

@app.get('/')
def read_root():
  return {'message': 'Hello from FastAPI!'}

@app.post('/removeToxic/')
def check_for_toxicity(item: Item):
    print(item.sentence_for_analysis)
    try:
        sentence = item.sentence_for_analysis
        toxic_status = check_toxicity_api(sentence)
        if toxic_status:
          response_json = {'info': "Success", 'toxic': True}
          return response_json
        else:
          response_json = {'info': "Success", 'toxic': False}
          return response_json
    except Exception as e:
        print(e)
        response_json = {'info': e, 'error': True}
        return response_json