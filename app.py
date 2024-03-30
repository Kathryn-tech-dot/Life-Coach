import nltk
nltk.download('popular')
nltk.download('vader_lexicon')
from nltk.stem import WordNetLemmatizer
from nltk.sentiment import SentimentIntensityAnalyzer
import pickle
import numpy as np
from keras.models import load_model

import json
import random
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow as tf
import joblib
from flask import Flask, render_template, request, redirect, url_for, g, jsonify, flash
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
import re
import spacy
from spacy.language import Language
from spacy_langdetect import LanguageDetector
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
from keras.models import load_model
from flask import Flask, request, jsonify
from datetime import datetime
from flask import session
from textblob import TextBlob 
import plotly.graph_objs as go




# Load the Keras model
model = load_model(r'C:\Users\CATE\Documents\Life Coach\model.h5')

# Load intents from JSON file
intents = json.loads(open(r'C:\Users\CATE\Documents\Life Coach\data\intent.json').read())

# Initialize NLTK lemmatizer
lemmatizer = WordNetLemmatizer()

# Load vocabulary and classes
words = pickle.load(open('C:/Users/CATE/Documents/Life Coach/texts.pkl', 'rb'))
classes = pickle.load(open('C:/Users/CATE/Documents/Life Coach/labels.pkl', 'rb'))



from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

eng_swa_model_checkpoint = "C:\\Users\\CATE\\Documents\\Life Coach\\engswamodel\\eng_swa_model"
swa_eng_model_checkpoint = "C:\\Users\\CATE\\Documents\\Life Coach\\engswamodel\\swa_eng_model"

# Load tokenizer and model for English to Swahili translation
eng_swa_tokenizer = AutoTokenizer.from_pretrained(eng_swa_model_checkpoint)
eng_swa_model = AutoModelForSeq2SeqLM.from_pretrained(eng_swa_model_checkpoint)
eng_swa_translator = pipeline(
    "text2text-generation",
    model=eng_swa_model,
    tokenizer=eng_swa_tokenizer,
)

def translate_text_eng_swa(text):
    translated_text = eng_swa_translator(text, max_length=128, num_beams=5)[0]['generated_text']
    return translated_text

# Load tokenizer and model for Swahili to English translation
swa_eng_tokenizer = AutoTokenizer.from_pretrained(swa_eng_model_checkpoint)
swa_eng_model = AutoModelForSeq2SeqLM.from_pretrained(swa_eng_model_checkpoint)
swa_eng_translator = pipeline(
    "text2text-generation",
    model=swa_eng_model,
    tokenizer=swa_eng_tokenizer,
)

def translate_text_swa_eng(text):
    translated_text = swa_eng_translator(text, max_length=128, num_beams=5)[0]['generated_text']
    return translated_text

# Example usage:
english_text = "Hello, how are you?"
swahili_translation = translate_text_eng_swa(english_text)
print("Swahili translation:", swahili_translation)

swahili_text = "Jambo, unaendeleaje?"
english_translation = translate_text_swa_eng(swahili_text)
print("English translation:", english_translation)


# Define functions for cleaning up sentences and predicting intents
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

def bow(sentence, words, show_details=True):
    sentence_words = clean_up_sentence(sentence)
    bag = [0]*len(words)  
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s: 
                bag[i] = 1
                if show_details:
                    print ("found in bag: %s" % w)
    return(np.array(bag))

def predict_class(sentence, model):
    p = bow(sentence, words, show_details=False)
    res = model.predict(np.array([p]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})
    return return_list

def getResponse(ints, intents_json):
    tag = ints[0]['intent']
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if i['tag'] == tag:
            result = random.choice(i['responses'])
            break
    return result

def chatbot_response(msg):
    ints = predict_class(msg, model)
    res = getResponse(ints, intents)
    return res

# Database setup
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = mysql.connector.connect(
            host='localhost',
            user='root',
            password='123450987698',
            database='life_coach'
        )
    return db

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            cursor = db.cursor()
            cursor.execute(f.read())
            db.commit()

# User authentication and signup
def validate_signup(username, email, password, password_repeat):
    db = get_db()
    cursor = db.cursor()
    error_messages = []

    cursor.execute('SELECT * FROM users WHERE username = %s OR email = %s', (username, email))
    existing_user = cursor.fetchone()

    if existing_user:
        error_messages.append('Username or email already exists')

    if not username.isalpha():
        error_messages.append('Username should contain only alphabetic letters')

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        error_messages.append('Email should have a valid format')

    if password != password_repeat:
        error_messages.append('Passwords do not match')

    if not (len(password) >= 8 and any(c.isalpha() for c in password) and any(c.isdigit() for c in password)):
        error_messages.append('Password should have at least 8 characters, contain letters and digits')

    if not error_messages:
        hashed_password = generate_password_hash(password)
        cursor.execute('INSERT INTO users (username, email, password) VALUES (%s, %s, %s)', (username, email, hashed_password))
        db.commit()
        return True, None
    else:
        return False, error_messages

def validate_login(username, password):
    db = get_db()
    cursor = db.cursor()

    cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
    user_data = cursor.fetchone()

    if user_data and check_password_hash(user_data[2], password):
        return True, None
    else:
        return False, 'Invalid username or password'

# Create Flask app
app = Flask(__name__)
app.secret_key = os.urandom(24)

# Flask routes
@app.route("/")
def home():
    return render_template("index.html",existing_testimonials=existing_testimonials)

@app.route("/signup", methods=['POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        password_repeat = request.form['password-repeat']

        validation_success, error_messages = validate_signup(username, email, password, password_repeat)

        if validation_success:
            flash('Signup successful', 'success')
            return redirect(url_for('chatbot'))
        else:
            for error in error_messages:
                flash(error, 'error')
            return redirect(url_for('home'))

@app.route("/login", methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        validation_success, error_message = validate_login(username, password)

        if validation_success:
            flash('Login successful', 'success')
            return redirect(url_for('chatbot'))
        else:
            flash(error_message, 'error')
            return redirect(url_for('home'))

@app.route("/chatbot", methods=['GET', 'POST'])
def chatbot():
    if request.method == 'POST':
        user_input = request.form['user_input']
        response = chatbot_response(user_input)
        print("Response from chatbot:", response)  # Add this line for debugging
        return render_template('chatbot.html', response=response)
    else:
        return render_template('chatbot.html', chat_history=[])

#Route for handling the search query
@app.route("/search", methods=["GET"])
def search():
    # Get the search query from the request parameters
    query = request.args.get("query")
    
    # Perform search logic here (e.g., query your database or external API)
    # For demonstration purposes, let's just print the search query
    print("Search query:", query)

    # Return a response (you can render a template or return JSON data)
    return f"Search results for: {query}"    

    # Initialize existing testimonials list
existing_testimonials = []

@app.route('/get_existing_testimonials')
def get_existing_testimonials():
    return jsonify(existing_testimonials)

@app.route('/add_testimonial', methods=['POST'])
def add_testimonial():
    data = request.json
    if 'username' in data and 'testimonial' in data:
        username = data['username']
        testimonial = data['testimonial']
        existing_testimonials.append({"username": username, "testimonial": testimonial})
        return jsonify({"success": True, "message": "Testimonial added successfully"})
    else:
        return jsonify({"success": False, "message": "Invalid data format"}), 400    


# Route for processing user input and generating chatbot response
@app.route("/process_input", methods=["POST"])
def process_input():
    data = request.json
    user_input = data.get("input")
    bot_response = chatbot_response(user_input)
    return jsonify({'response': bot_response})



                     # FIRST OBJECTIVE
def initialize_sentiment_analyzer():
    from nltk.sentiment import SentimentIntensityAnalyzer
    return SentimentIntensityAnalyzer()

# Initialize the sentiment analyzer
sid = SentimentIntensityAnalyzer()

# Route for performing sentiment analysis
@app.route('/sentiment_analysis', methods=['POST'])
def perform_sentiment_analysis():
    data = request.json
    conversation = data.get('conversation')

    if not conversation:
        return jsonify({'error': 'No conversation data provided'}), 400

    # Perform sentiment analysis on the conversation
    # Tokenize the conversation into sentences
    sentences = nltk.sent_tokenize(conversation)

    # Initialize the sentiment scores
    total_score = 0

    # Analyze the sentiment of each sentence and calculate the total score
    for sentence in sentences:
        sentiment_score = sid.polarity_scores(sentence)['compound']
        total_score += sentiment_score

    # Calculate the average sentiment score
    average_score = total_score / len(sentences)

    # Determine the sentiment label based on the average score
    if average_score > 0.05:
        sentiment_result = "Positive"
        response = "Hurray! Continue with the spirit."
    elif average_score < -0.05:
        sentiment_result = "Negative"
        response = "I'm so sorry you're going through a lot. Kindly speak to me or go to the recommendations and get to listen to some motivational videos and read articles to feel motivated."
    else:
        sentiment_result = "Neutral"
        response = "Keep up with the spirit."

    # Return the sentiment result and the appropriate response
    return jsonify({'sentiment_result': sentiment_result, 'response': response})

# Route for getting recommendations
@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    return render_template('recommendations.html')

# Route for showing notifications
@app.route('/notifications',methods=['GET'])
def show_notifications():
    # Return "No notifications yet" message
    notifications = "No notifications yet"
    return render_template('notifications.html', notifications=notifications)


# Route for logging out and redirecting to homepage
@app.route('/logout')
def logout():
    # Redirect to homepage
    return redirect(url_for('homepage'))
if __name__ == "__main__":
    app.run(debug=True)
