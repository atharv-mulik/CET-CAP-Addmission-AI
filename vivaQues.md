# CAP Admission AI - Project Viva Examination Guide

This document provides a deep technical analysis of the project, categorized into sections covering the entire full-stack architecture, algorithms, and logic.

## 1. Project Overview & Architecture

**Q1: What is the overall architecture of your project?**
**A:** The project follows a **Microservices-based Architecture** consisting of three main layers:
1.  **Frontend**: Built with **React** and **Material UI (MUI)** for the user interface.
2.  **Backend API**: A **Spring Boot** application that manages business logic, PostgreSQL database, and security.
3.  **AI Service**: A **FastAPI (Python)** microservice that hosts the Machine Learning model for admission prediction.
Communication between these services happens via **RESTful APIs**.

**Q2: Why did you choose a separate Python service for AI?**
**A:** Python has the most robust ecosystem for AI/ML (libraries like Scikit-Learn, Pandas). By using FastAPI, we keep the AI logic decoupled from the core business backend, allowing us to scale the prediction service independently.

---

## 2. Artificial Intelligence & Machine Learning

**Q3: Which Machine Learning algorithm is used for college prediction?**
**A:** We use the **Random Forest Classifier**.

**Q4: Explain the Random Forest algorithm in the context of your project.**
**A:** Random Forest is an **Ensemble Learning** method that builds multiple **Decision Trees** and merges them together to get a more accurate and stable prediction.
-   **Bootstrap Aggregating (Bagging)**: It trains each tree on a random subset of the data.
-   **In our project**: It takes inputs like `rank`, `category`, and `preferred branch` to predict the `college_tier` (Top, Medium, or Low) where a student has the best chance.

**Q5: How did you train the model?**
**A:**
1.  **Data Generation**: Since real admission data is sensitive, we generated **10,000 synthetic records** mimicking real-world trends (e.g., Computer branch has higher cutoffs).
2.  **Preprocessing**: Categorical data (`category`, `branch`) was converted to numerical format using **LabelEncoder**.
3.  **Training**: Split data into training (80%) and testing (20%) sets using Scikit-learn.
4.  **Inference**: The model is saved as a `.pkl` file using **joblib** and served via FastAPI.

---

## 3. Backend Implementation (Spring Boot)

**Q6: What is the role of Spring Boot in this project?**
**A:** Spring Boot acts as the **Orchestrator**. It handles:
-   **User Authentication**: Using Spring Security and JWT.
-   **Database Management**: Using Spring Data JPA (Hibernate) to interact with PostgreSQL.
-   **Service Integration**: It calls the Python AI service using `RestTemplate` to fetch predictions and filters them against the physical database.

**Q7: How do you handle database persistence?**
**A:** We use **PostgreSQL** as our RDBMS. We use **Spring Data JPA** which allows us to write Java interfaces (Repositories) to perform CRUD operations without writing raw SQL. For the prediction logic, we use custom **@Query** annotations to filter colleges by rank and category.

---

## 4. Frontend & User Experience (React)

**Q8: What technologies are used in the frontend?**
**A:**
-   **React 18**: For building a component-based reactive UI.
-   **Material UI (MUI)**: For professional, responsive components and theming.
-   **Framer Motion**: For smooth micro-animations (e.g., page transitions).
-   **Axios**: For making asynchronous HTTP requests to the backend.

**Q9: How do you maintain user state across the app?**
**A:** We use **localStorage** to store the JWT token and basic user profile information. This allows the app to remember the user even after a page refresh and ensures that the Prediction page always has access to the user's rank and category.

---

## 5. Security & Integration

**Q10: How did you implement Security in the project?**
**A:** We used **Stateless Authentication** via **JWT (JSON Web Tokens)**:
1.  User logs in; Backend verifies credentials and generates a signed JWT.
2.  The token is sent to the frontend and stored.
3.  For every subsequent protected request, the frontend sends the token in the `Authorization: Bearer <token>` header.
4.  The backend's `JwtAuthenticationFilter` intercepts the request, validates the token, and sets the Security Context.

**Q11: What is CORS and how did you handle it?**
**A:** **Cross-Origin Resource Sharing (CORS)** is a security feature that prevents a website from making requests to a different domain. Since our React app (Port 5173) talks to Spring Boot (Port 8080), we had to explicitly allow this origin in `SecurityConfig.java` using `configuration.setAllowedOrigins`.

---

## 6. Business Logic (CAP Admission Flow)

**Q12: How does the Admission Tracker logic work?**
**A:** The tracker uses a state-based approach. We have a table `application_status` in the database that tracks individual steps like *Document Verification*, *Option Form Filling*, and *Seat Acceptance*. The frontend dynamically updates the progress bar based on these flags.

**Q13: Explain the "Hybrid Prediction" logic.**
**A:**
1.  The frontend sends rank/category to the Backend.
2.  The Backend calls the **AI Service** to get a "Predicted Tier" (e.g., "Top Tier").
3.  The Backend then queries the **PostgreSQL Database** for colleges that match that Tier AND satisfy the physical cutoff rank for the user's category.
4.  If the AI is offline, the system automatically falls back to a **Rule-based SQL query** to ensure the user always sees results.
