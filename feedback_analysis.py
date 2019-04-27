#!/usr/bin/env python
# -*- coding: utf-8 -*-
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

import os
import re
import sys
import time
import uuid
import pickle
import logging
import itertools
import numpy as np
import pandas as pd
import seaborn as sns
import tensorflow as tf
import simplejson as json
from flask_cors import CORS
from termcolor import cprint
import matplotlib.pyplot as plt
from pprint import pprint, pformat
from flask import Flask, jsonify, request
from tensorflow_hub_utils import get_message_embeddings

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
logging.getLogger('flask_cors').level = logging.DEBUG

sentiment_analyzer = SentimentIntensityAnalyzer()

@app.route('/api/submit_statement/', methods=['POST'])
def submit_statment():
    statement = json.loads(request.data)['statement']

    cprint(statement['mode'], 'magenta', 'on_yellow')

    if statement['mode'] in ['text', 'speech']:
        cprint('Analysing text/speech sentiment', 'magenta', 'on_white')
        statement['sentiment'] = sentiment_analyzer.polarity_scores(statement['text'])['compound']
        cprint(statement, 'magenta')

        cprint('Encoding text/speech semantic embedding', 'magenta', 'on_white')
        message_embedding = get_message_embeddings([statement['text']])[0]
        statement['message_embedding_vec'] = message_embedding.tolist()

        # n by 512
        cprint(message_embedding.shape, 'magenta')

    if os.path.exists('statement_data.pkl'):
        with open('statement_data.pkl', 'rb') as handle:
            statement_list = pickle.load(handle)
    else:
        statement_list = []

    statement_list.append(statement)

    with open('statement_data.pkl', 'wb') as handle:
        pickle.dump(statement_list, handle, protocol=pickle.HIGHEST_PROTOCOL)

    cprint(statement_list, 'green')
    return jsonify({})

@app.route('/api/statements/', methods=['GET'])
def get_statements():
    print(request.args)

    with open('statement_data.pkl', 'rb') as handle:
        statement_list = pickle.load(handle)

    return jsonify(statement_list)

@app.route('/api/statements/', methods=['DELETE'])
def clear_statements():
    cprint('Clearing all statements!', 'white', 'on_red')
    statement_list = []

    with open('statement_data.pkl', 'wb') as handle:
        pickle.dump(statement_list, handle, protocol=pickle.HIGHEST_PROTOCOL)

    return jsonify(statement_list)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4444, debug=True)
