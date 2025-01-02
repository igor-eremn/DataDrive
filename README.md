# 🚗 Data Drive 🚗

## 👨‍💻 Overview

Vehicle Dashboard is a real-time monitoring system that provides live updates on various vehicle metrics such as battery status, motor speed, power consumption, and temperature. The system consists of a React-based frontend for displaying the dashboard and an Express.js backend that handles API requests and WebSocket connections for real-time data broadcasting. The data is stored in a PostgreSQL database, which is hosted on Google Cloud Services with public access enabled to allow seamless updates and monitoring.

## 🚀 Installation Instructions

### 1. Clone the Repository
Clone with GitHub link:
```
git clone https://github.com/igor-eremn/DataDrive.git
```
Navigate to project
```
cd DataDrive
```
### 2. Run the Frontend (React)
Navigate to the client folder:
```
cd client
```
Install dependencies:
```
npm install
```
Start the React development server:
```
npm run dev
```

### 3. Run the Backend (Node.js)
Navigate to the server folder:
```
cd ../server
```
Install dependencies:
```
npm install
```
Start the Express.js server:
```
node server.js
```

## 🗄️ Accessing the Public Database

The Vehicle Dashboard uses a **PostgreSQL database** hosted on **Google Cloud Services** for storing and retrieving data. You can access the database using the terminal with the following steps:

---

### 1. Prerequisites
Ensure you have **PostgreSQL client tools** installed. Install it using:
   - **macOS (Homebrew)**:
     ```
     brew install postgresql
     ```
   - **Ubuntu/Debian**:
     ```
     sudo apt update
     sudo apt install postgresql-client
     ```
   - **Windows**:
     Download and install the PostgreSQL client from [https://www.postgresql.org/download/](https://www.postgresql.org/download/).

Verify the installation by running:
   ```
   psql --version
   ```
### 2. Access the Public Database
Run the following command in your terminal to connect to the database:
```
psql --host=35.225.39.191 --port=5432 \
  --username=public_user \
  --dbname=vehicle_data
```

When prompted, enter user password:
```
PublicUserPassword
```

### 3. Commands to Check Data
View all data in the dashboard table:
```
SELECT * FROM dashboard;
```
Monitor the dashboard table in real-time (refresh every 2 seconds):
```
SELECT * FROM dashboard \watch 2;
```

### 📝 Notes
- **Public Access**: The database is publicly accessible, but only read permissions are provided to the public user.
- **Usage**: These commands allow you to periodically check real-time data updates in the database.
