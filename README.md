# Polymarket_clone
A decentralized-style prediction market platform replica built using Flask (Python), React, and MongoDB, containerized with Docker, featuring a simulated virtual currency wallet system.

# Polymarket Clone: Simulated Prediction Market Platform

A full-stack, containerized prediction market application that replicates the core functionality of platforms like Polymarket. This project is built as a development demo using a custom **React + Flask + MongoDB** architecture, completely containerized using Docker and Docker Compose. 

To keep the application safe and accessible for demonstration purposes, it completely eliminates real-world currency or blockchain wallet requirements, substituting them with a simulated, high-performance virtual currency ecosystem (**"Platform Bucks"**).

---

## Features

* **Simulated Wallet Architecture:** Automated registration granting new profiles 1,000 fictional "Bucks" to participate instantly.
* **Dual-Container Environment:** Independent compilation profiles for the Python Flask API layer and NoSQL database to ensure isolation.
* **Zero-Local Dependency Deployment:** Configured natively for instant deployment via GitHub Codespaces or Docker Desktop.

---

##  Tech Stack

* **Frontend:** React, Node.js, npm
* **Backend:** Python 3.11, Flask, Flask-CORS
* **Database:** MongoDB
* **Deployment & Containerization:** Docker, Docker Compose

---
## Repository Structure

```text
polymarket-clone/
├── backend/                  # Python Flask Engine
│   ├── app.py                # Main server routes & gateway
│   ├── db.py                 # Database initialization & connections
│   ├── Dockerfile            # Python environment compilation script
│   └── requirements.txt      # Python dependencies list
├── frontend/                 # React UI Application
│   └── Dockerfile            # Node environment compilation script
└── docker-compose.yml        # Multi-container orchestration blueprint
