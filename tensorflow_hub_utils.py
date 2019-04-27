#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import re
import logging
import numpy as np
import pandas as pd
import seaborn as sns
import tensorflow as tf
import tensorflow_hub as hub
import matplotlib.pyplot as plt

print('TensorFlow version: {}'.format(tf.__version__))

def get_message_embeddings(messages):
    # Import the Universal Sentence Encoder's TF Hub module
    embed = hub.Module('https://tfhub.dev/google/universal-sentence-encoder/2')
    with tf.Session() as session:
        session.run([tf.global_variables_initializer(), tf.tables_initializer()])
        message_embeddings = session.run(embed(messages))
    
    return message_embeddings

if __name__ == '__main__':
    print(tf.__version__)

    paragraph = (
        "Universal Sentence Encoder embeddings also support short paragraphs. "
        "There is no hard limit on how long the paragraph is. Roughly, the longer "
        "the more 'diluted' the embedding will be.")

    message_embedding = get_message_embeddings([paragraph])[0]

    # n by 512
    print(message_embedding.shape)
