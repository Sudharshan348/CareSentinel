# CareSentinel

## Python Model

The `chronic-disease-model.ipynb` notebook performs the following steps:

1.  **Data Loading and Preprocessing**: It loads patient data from various CSV files, including patient information, immunizations, allergies, and medications. This data is then cleaned and merged into a single DataFrame.

2.  **Feature Engineering**: New features are created from the existing data, such as `Immunization Count`, `Allergy Count`, and `Medication Reason Count`, to be used in the machine learning model.

3.  **Risk Prediction Model**: An XGBoost Classifier model is trained to predict the 90-day risk of a health-related event for each patient. For the purpose of this demonstration, the target variable (`risk_in_90_days`) is simulated.

4.  **Prediction and Output**: The trained model is used to predict the risk for a test set of patients. The predictions, including a "Risk Factor Percentage" and a categorical "Risk Level" (Low, Medium, High, Very High), are saved to a CSV file.

5.  **Data Visualization**: The notebook generates and saves several plots to visualize the risk distribution among the patient cohort.

## Frontend

To run the frontend development server, follow these steps:

1.  Install the necessary dependencies:
    ```bash
    npm install
    ```

2.  Run the development server:
    ```bash
    npm run dev
    ```
The dashboard takes sample data and creates visualizations.
