# Deploying Full-Stack Project to GitHub

This guide covers how to push your CAP Admission AI full-stack application (Frontend + Backend + ML Service) to a GitHub repository, effectively creating a backup, version control history, and laying the groundwork for live deployment. 

> [!CAUTION]
> **Important Note:** A true "Full-Stack Application" (React + Spring Boot + Python FastAPI) **cannot** be entirely hosted or "run live" on GitHub alone. GitHub only hosts your static files and source code. However, pushing your code to GitHub is step 1. Step 2 requires using deployment platforms like Vercel, Render, or Railway. 

---

## Part 1: Initializing Git Locally

Before pushing code to GitHub, you need to track your code locally using Git.

### 1. Check your `.gitignore` File
Ensure your `.gitignore` in the root specific directory blocks unnecessary files from uploading. We have already updated your `.gitignore` to include important ignores like `node_modules`, `.env`, `target/` and `__pycache__`.

### 2. Initialize the Git Repository
Run these commands in your project's root terminal (`cap-admission-ai` folder):

```bash
# Initialize a new git repository
git init

# Stage all files for a commit
git add .

# Create your first "commit" (Snapshot of your code)
git commit -m "Initial commit for CAP Admission AI"
```

---

## Part 2: Pushing to GitHub

### 1. Create a Repository on GitHub
1. Log into your account at [GitHub](https://github.com/).
2. In the top right corner, click the **`+`** icon and select **New repository**.
3. Name your repository (e.g., `cap-admission-ai`).
4. Keep it **Public** or **Private** based on your preference.
5. **Do not** check "Add a README file" or ".gitignore" since we already have them locally.
6. Click **Create repository**.

### 2. Link Local Code to GitHub Repo
Once created, GitHub will show you a page with commands under "_…or push an existing repository from the command line_". Copy and run those commands in your terminal:

```bash
# Example commands (Replace YOUR_USERNAME and YOUR_REPO_NAME):
git remote add origin https://github.com/YOUR_USERNAME/cap-admission-ai.git
git branch -M main
git push -u origin main
```

At this point, your code is safely backed up on GitHub! 🎉

---

## Part 3: Deploying the Application Live (Optional)

If your goal is to make your web app accessible to users around the world via a public URL, you'll need to use cloud hosting platforms that directly read off your newly created GitHub repository.

### A. Frontend (React / Vite)
Deploy your frontend to **Vercel** or **Netlify**:
1. Create an account on [Vercel](https://vercel.com/) corresponding to your GitHub Account.
2. Click **Add New Project** and import your GitHub repository.
3. Configure the **Build Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (if package.json is in root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy!

### B. Backend (Java / Spring Boot) + Database
Deploy your Java API to **Render**, **Railway**, or **Heroku**:
1. Connect your GitHub repository to [Render](https://render.com/).
2. Create a new **PostgreSQL** database on Render and note the connection URI.
3. Create a **Web Service** in Render from your repo.
4. Set the **Root Directory** to `backend/`.
5. Set the Build Command to: `mvn clean package -DskipTests`
6. Set the Start Command to: `java -jar target/your-app-name.jar`
7. In the Environment Variables section, add your Database URI, Username, and Passwords.

### C. ML Service (Python / FastAPI)
Deploy the Python app to a separate **Render Web Service** or Python-specific host like PythonAnywhere.
1. Connect repo to Render > **New Web Service**.
2. **Root Directory**: `ml_service/`
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `python main.py` or use uvicorn explicitly: `uvicorn main:app --host 0.0.0.0 --port 10000`

> [!WARNING]
> Don't forget to update your frontend's environment variables (`.env`) to point to the live URLs of the new Python and Spring Boot Backends, rather than `http://localhost:XXXX` otherwise your deployed website will fail to fetch data.
