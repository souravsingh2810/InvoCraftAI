# 🚀 InvoCraftAI

**InvoCraftAI** is an AI-powered invoice generation platform that allows businesses to create professional invoices using natural language prompts.
The application integrates **Google Gemini AI** to convert prompts into structured invoice data and uses the **MERN stack** to manage, store, and display invoices efficiently.

The platform also includes **secure authentication using Clerk**, ensuring that users can safely manage their invoices and business records.

---
**Live Link**
[https://github.com/yourusername](https://github.com/yourusername)
# 📌 Table of Contents

* About the Project
* Features
* Tech Stack
* Architecture Overview
* Project Structure
* Installation
* Environment Variables
* Usage
* Example Prompt
* Future Improvements
* Contributing
* License
* Author

---

# 📖 About the Project

Small businesses often spend time manually creating invoices. **InvoCraftAI** simplifies this process by allowing users to generate invoices using simple prompts like:

> "Create an invoice for 5 laptops priced at ₹50,000 each for client ABC Technologies."

The system uses **Gemini AI** to understand the prompt and generate structured invoice details automatically.

Users can then **view, manage, and store invoices** within the application.

---

# ✨ Features

### 🤖 AI-Powered Invoice Generation

Generate invoices instantly using **Google Gemini AI** with natural language prompts.

### 🧾 Smart Invoice Formatting

Converts AI-generated responses into structured invoice layouts.

### 🔐 Secure Authentication

User authentication and session management powered by **Clerk**.

### 💾 Invoice Management

Store and manage invoices in the database.

### ⚡ Full MERN Stack Application

Modern full-stack architecture using:

* MongoDB
* Express.js
* React.js
* Node.js

### 🎨 Modern Responsive UI

Clean and responsive user interface for seamless user experience.

---

# 🛠 Tech Stack

## Frontend

* React.js
* Clerk Authentication
* Tailwind CSS (optional)

## Backend

* Node.js
* Express.js

## Database

* MongoDB

## AI Integration

* Google Gemini API

---

# 🧠 Architecture Overview

```
User Prompt
     │
     ▼
Frontend (React)
     │
     ▼
Backend API (Node + Express)
     │
     ▼
Gemini AI API
     │
     ▼
Structured Invoice Data
     │
     ▼
MongoDB Database
     │
     ▼
Invoice Display in UI
```

---

# 📂 Project Structure

```
InvoCraftAI-AI
│
├── frontend
│   ├── components
│   ├── pages
│   ├── services
│   └── styles
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   └── config
│
├── .env
├── package.json
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/InvoCraftAI-ai.git
cd InvoCraftAI-ai
```

---

## 2️⃣ Install dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

---

## 3️⃣ Setup environment variables

Create a `.env` file inside the **backend folder**.

Example:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

---

## 4️⃣ Run the application

Start backend server:

```bash
cd backend
npm start
```

Start frontend:

```bash
cd frontend
npm run dev
```

---

# 🚀 Usage

1. Sign in using **Clerk authentication**
2. Enter a prompt describing the invoice
3. Gemini AI generates structured invoice data
4. View and manage invoices inside the dashboard

---

# 💡 Example Prompt

```
Create an invoice for 10 chairs priced at ₹2000 each for client XYZ Pvt Ltd.
```

The AI will generate invoice details such as:

* Client name
* Items
* Quantity
* Price
* Total amount

---

# 📈 Future Improvements

* 📊 Business analytics dashboard
* 📤 Export invoices as PDF
* 📧 Send invoices via email
* 📱 Mobile responsive optimization
* 🤖 AI-powered business insights
* 📊 Financial tracking

---

# 🤝 Contributing

Contributions are welcome.

Steps to contribute:

1. Fork the repository
2. Create a new branch

```
git checkout -b feature-name
```

3. Commit your changes

```
git commit -m "Added new feature"
```

4. Push the branch

```
git push origin feature-name
```

5. Create a Pull Request

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Sourav Singh**



