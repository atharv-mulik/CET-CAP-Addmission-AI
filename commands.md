# CAP Admission AI - Startup Guide 🚀

This guide provides the commands to start the entire full-stack application. Please open **three separate terminals** to run the services simultaneously.

---

## 1. AI Logic Service (Python/FastAPI)
This service must be running for admission predictions to work properly.

**Terminal 1:**
```powershell
# Navigate to the ML service directory (if not already there)
cd ml_service

# Install dependencies (only required once)
pip install -r requirements.txt

# Start the service
python main.py
```
*   **Port**: 5000
*   **Verification**: Open [http://localhost:5000](http://localhost:5000) (Should show documentation or status)

---

## 2. Backend API (Spring Boot)
The central orchestrator that handles the database and security.

**Terminal 2:**
```powershell
# Navigate to the backend directory
cd backend

# Compile and start the Spring Boot app
mvn spring-boot:run -DskipTests
```
*   **Port**: 8080
*   **Database**: Ensure your PostgreSQL service is running on Port 5432.
*   **Verification**: Open [http://localhost:8080/api/colleges](http://localhost:8080/api/colleges)

---

## 3. Frontend Dashboard (React/Vite)
The user interface.

**Terminal 3:**
```powershell
# Run from the project root directory
npm run dev
```
*   **Port**: 5173
*   **Verification**: Open [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Troubleshooting: "Port already in use"
If any service fails to start because the port is busy, run this command to clear zombie processes:

**For Windows (PowerShell):**
```powershell
# Kill anything on 8080 (Backend)
FOR /F "tokens=5" %a in ('netstat -ano ^| findstr :8080') do taskkill /F /PID %a /T

# Kill anything on 5173 (Frontend)
FOR /F "tokens=5" %a in ('netstat -ano ^| findstr :5173') do taskkill /F /PID %a /T

# Kill anything on 5000 (AI)
FOR /F "tokens=5" %a in ('netstat -ano ^| findstr :5000') do taskkill /F /PID %a /T
```

---

## ✅ Final Verification
Once all three are running, go to [http://localhost:5173/profile](http://localhost:5173/profile), save your data, and click on **Prediction**. Everything should work seamlessly!
