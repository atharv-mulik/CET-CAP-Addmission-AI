import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Ensure directory exists
if not os.path.exists('model_artifacts'):
    os.makedirs('model_artifacts')

# 1. Generate Synthetic Historic Data
# We simulate 10,000 student records with:
# - Rank: 1 - 150,000
# - Category: OPEN, OBC, SC, ST
# - Branch: Computer, IT, ENTC, Mechanical
# - Outcome: College Tier (Top, Medium, Low)

print("Generating synthetic training data...")

np.random.seed(42)
n_samples = 10000

data = {
    'rank': np.random.randint(100, 150000, n_samples),
    'category': np.random.choice(['OPEN', 'OBC', 'SC', 'ST'], n_samples),
    'branch': np.random.choice(['Computer', 'IT', 'ENTC', 'Mechanical'], n_samples),
    'percentile': np.random.uniform(10, 99.9, n_samples)
}

df = pd.DataFrame(data)

# Define Logic for "Ground Truth" (This mimics real world trends for training)
def assign_college_tier(row):
    rank = row['rank']
    cat = row['category']
    branch = row['branch']
    
    # Adjust effective rank based on category benefit (Simulating Reservation)
    effective_rank = rank
    if cat == 'OBC': effective_rank *= 0.85
    if cat == 'SC': effective_rank *= 0.6
    if cat == 'ST': effective_rank *= 0.4
    
    # Branch difficulty
    if branch == 'Computer': effective_rank *= 1.2 # Harder to get
    if branch == 'IT': effective_rank *= 1.1

    if effective_rank < 5000: return 'Top Tier (COEP/VJTI)'
    if effective_rank < 30000: return 'High Tier (VIT/PCCOE)'
    if effective_rank < 60000: return 'Medium Tier (DY Patil/JSPM)'
    return 'Tier 3 / Local Colleges'

df['target_college_type'] = df.apply(assign_college_tier, axis=1)

print("Data sample head:")
print(df.head())

# 2. Preprocessing
le_cat = LabelEncoder()
le_branch = LabelEncoder()
le_target = LabelEncoder()

df['category_encoded'] = le_cat.fit_transform(df['category'])
df['branch_encoded'] = le_branch.fit_transform(df['branch'])
df['target_encoded'] = le_target.fit_transform(df['target_college_type'])

X = df[['rank', 'category_encoded', 'branch_encoded']]
y = df['target_encoded']

# 3. Train Model
print(f"Training Random Forest on {n_samples} samples...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print(f"Model Training Complete. Accuracy: {accuracy:.2f}")

# 4. Save Artifacts
joblib.dump(model, 'model_artifacts/admission_model.pkl')
joblib.dump(le_cat, 'model_artifacts/le_cat.pkl')
joblib.dump(le_branch, 'model_artifacts/le_branch.pkl')
joblib.dump(le_target, 'model_artifacts/le_target.pkl')

print("Model and Encoders saved to 'model_artifacts/' directory.")
