Overview

This is a web-based expense tracker enhanced with AI-powered features. It allows users to record, categorize, visualize, and export expenses while also predicting next month’s spending using a simple regression-based machine learning model implemented in JavaScript.

The project demonstrates how basic machine learning can be integrated into a front-end application for actionable insights.

⸻

Key Features
	•	Add/Edit/Delete Expenses: Track daily spending by category.
	•	Categorization: Organize expenses into categories like Food, Rent, Transport, and Relaxation.
	•	Visualization: Interactive Pie Chart using Chart.js showing distribution of expenses.
	•	AI-Based Prediction:
	•	Uses linear regression to predict next month’s spending based on historical monthly totals.
	•	Provides next month expense estimate with one click.
	•	Data Export Options:
	•	Download expenses as CSV, Excel, or PDF.
	•	Local Storage: All expenses are saved locally in the browser for persistence.

⸻

Tech Stack
	•	Frontend: HTML, CSS, JavaScript
	•	Libraries/Plugins:
	•	Chart.js￼ – For visualizing expenses
	•	XLSX.js￼ – For Excel export
	•	jsPDF + jsPDF-AutoTable￼ – For PDF export
	•	ML Logic: Implemented in JavaScript using linear regression on monthly totals.

⸻

How It Works
	1.	Adding Expenses: Users input category, amount, and date. Entries are stored in browser local storage.
	2.	Table & Chart Update: Each addition or deletion updates the expense table, total sum, and Pie Chart dynamically.
	3.	Next Month Prediction:
	•	The app groups historical expenses by month.
	•	Performs linear regression on month indices vs total monthly spending.
	•	Outputs the predicted total for the next month.
	4.	Exporting Data:
	•	CSV: Easy-to-read spreadsheet format.
	•	Excel: Full workbook using XLSX.js.
	•	PDF: Printable report using jsPDF and autoTable.

⸻

Why This Project Is AI-Powered
	•	Implements machine learning logic to provide predictive insights rather than just tracking.
	•	Demonstrates regression-based expense forecasting in a browser environment using JavaScript.
	•	Offers AI-assisted decision-making for personal finance, helping users plan their next month’s budget.

⸻

Future Enhancements
	•	Include multiple regression using categories as features for more accurate predictions.
	•	Add mobile responsiveness and offline-first capabilities.
	•	Integrate with cloud storage for cross-device access.

⸻

Author

Shatakshi 
GitHub: shatakshi220805￼