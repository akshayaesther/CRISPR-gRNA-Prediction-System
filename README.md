# CRISPR gRNA Prediction System

A deep learning-based web application that predicts CRISPR guide RNA activity using DNA sequence analysis.

## Overview

The CRISPR gRNA Prediction System is a full-stack machine learning application developed to predict CRISPR activity scores from DNA sequences.

The system integrates a React-based user interface, backend APIs, and a deep learning model for DNA sequence prediction.

## Features

- User registration and authentication
- DNA sequence input and prediction
- Deep learning-based activity score prediction
- Interactive dashboard
- Prediction history management
- DNA sequence visualization
- ML prediction score visualization

## System Architecture

The system consists of three main components:

```text
CRISPR-gRNA-Prediction-System

|
├── backend
│   ├── Flask API
│   ├── TensorFlow/Keras Deep Learning Model
│   └── DNA Sequence Prediction Service
│
├── crispr_ui
│   └── React Frontend Application
│
└── db_server
    └── Node.js and Express Backend
```
## Technologies Used

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB

### Machine Learning
- Python
- TensorFlow
- Keras
- NumPy
- Scikit-learn

## Deep Learning Model

The prediction model analyzes DNA sequences and predicts CRISPR activity.

Model components:
- Convolutional Neural Network (CNN)
- Attention mechanism

Input:
- DNA nucleotide sequence (A, C, G, T)

Output:
- CRISPR activity prediction score

## Installation and Setup

### Frontend Setup
cd crispr_ui
npm install
npm start
### Node Backend Setup
cd db_server
npm install
node server.js
### Machine Learning Backend Setup
cd backend
pip install -r requirements.txt
python app.py
## Project Structure
backend - Machine learning model and prediction API
crispr_ui - React user interface
db_server - Node.js backend services
## Academic Project

This project was developed as a Final Year Project for the Bachelor of Technology in Information Technology program.

## Team Members

- Akshaya Esther A
- Hema B R
