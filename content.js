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
      title: "Supply Chain Performance & Delay Risk Prediction",
      skills: ["python", "sql", "machine-learning", "power-bi", "data-visualization", "business-operations"],
      desc:
        "Built a decision-support system for trade shipments. Tuned <strong>XGBoost</strong> predicts eligibility / delay risk <strong>(86.9% accuracy, ROC-AUC 0.96)</strong>. Used <strong>SHAP</strong> for explanations and a KPI dashboard for the results.",
      tech: "XGBoost, SHAP, Power BI, Python",
      caseUrl: "projects/supply-chain-analytics.html",
      githubUrl: "https://github.com/analysisbot-bi/supply--chain-dss",
    },
    {
      title: "Obesity Level Classification Using ANN",
      skills: ["python", "machine-learning", "data-visualization"],
      desc:
        "Compared three ANN architectures (baseline, deep, regularised) for 7-class obesity prediction. Used encoding, standardisation, dropout, and L2 regularisation. Best model hit <strong>~95% test accuracy</strong>. Checked results with confusion matrices and learning curves.",
      tech: "Python, TensorFlow / Keras, ANN / Deep Learning, Nov-Dec 2025",
      caseUrl: "projects/obesity-ann.html",
      githubUrl: "https://github.com/analysisbot-bi/obesity-level-classification-ann",
    },
  ],
};
