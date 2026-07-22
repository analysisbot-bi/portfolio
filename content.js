/* =========================================================
   EDIT THIS FILE to change skills and projects.
   After editing, refresh the page (hard refresh if needed).
   ========================================================= */

window.SITE = {
  skills: [
    { id: "python", label: "Python" },
    { id: "sql", label: "SQL" },
    { id: "machine-learning", label: "Machine Learning" },
    { id: "power-bi", label: "Power BI" },
    { id: "data-visualization", label: "Data Visualisation" },
    { id: "business-operations", label: "Business Operations" },
  ],

  projects: [
    {
      title: "Supply Chain Delay Risk",
      skills: ["python", "sql", "machine-learning", "power-bi", "data-visualization", "business-operations"],
      desc:
        "Shipment delay / eligibility model with <strong>XGBoost</strong> (<strong>86.9%</strong> accuracy, ROC-AUC <strong>0.96</strong>). Added <strong>SHAP</strong> plots and a KPI dashboard so non-tech people could read the risk scores.",
      tech: "Python · XGBoost · SHAP · Power BI",
      caseUrl: "projects/supply-chain-analytics.html",
      githubUrl: "https://github.com/analysisbot-bi/supply--chain-dss",
    },
    {
      title: "Obesity Level Classifier (ANN)",
      skills: ["python", "machine-learning", "data-visualization"],
      desc:
        "Tried three neural nets (baseline, deep, regularised) for 7 obesity classes. Best run was about <strong>95%</strong> test accuracy after dropout + L2. Checked confusion matrices and learning curves so I wasn't just trusting one number.",
      tech: "Python · Keras · scikit-learn · Nov-Dec 2025",
      caseUrl: "projects/obesity-ann.html",
      githubUrl: "https://github.com/analysisbot-bi/obesity-level-classification-ann",
    },
  ],
};
