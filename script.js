// --------------------------------------
// LocalStorage Functions
// --------------------------------------
function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function loadExpenses() {
    const stored = localStorage.getItem("expenses");
    return stored ? JSON.parse(stored) : [];
}

// --------------------------------------
// ML Feature: Predict Next Month Spending
// --------------------------------------
function predictNextMonth(expenses) {
    if (expenses.length === 0) {
        return 0;
    }

    // Group expenses by MONTH (YYYY-MM)
    const monthlyTotals = {};

    expenses.forEach(exp => {
        const dt = new Date(exp.date);
        if (isNaN(dt)) return;

        const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;

        if (!monthlyTotals[key]) monthlyTotals[key] = 0;
        monthlyTotals[key] += parseFloat(exp.amount);
    });

    const months = Object.keys(monthlyTotals).sort(); 
    const values = months.map(m => monthlyTotals[m]);

    // If only one month exists → just return the last month's total
    if (values.length === 1) {
        return values[0];
    }

    // Perform Linear Regression (y = m*x + c)
    const n = values.length;
    const x = [...Array(n).keys()];  // 0,1,2,3...
    const y = values;

    const sumX = x.reduce((a,b)=>a+b, 0);
    const sumY = y.reduce((a,b)=>a+b, 0);
    const sumXY = x.reduce((sum, xi, i)=> sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi)=> sum + xi*xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX**2);
    const intercept = (sumY - slope * sumX) / n;

    const nextMonthIndex = n;
    const predicted = slope * nextMonthIndex + intercept;

    return Math.max(predicted, 0).toFixed(2);
}

// --------------------------------------
// Global Data
// --------------------------------------
let expenses = loadExpenses();
let totalAmount = 0;
let chart;

// DOM
const categorySelect = document.getElementById("category-select");
const amountInput = document.getElementById("amount-input");
const dateInput = document.getElementById("date-input");
const addBtn = document.getElementById("add-btn");
const expensesTableBody = document.getElementById("expnese-table-body");
const totalAmountCell = document.getElementById("total-amount");

const predictBtn = document.getElementById("predict-btn");
const predictionResult = document.getElementById("prediction-result");

// --------------------------------------
// Restore UI on startup
// --------------------------------------
expenses.forEach(exp => {
    totalAmount += exp.amount;
    addExpenseRow(exp);
});
totalAmountCell.textContent = totalAmount;

updateChart(expenses);

// --------------------------------------
// Add Expense
// --------------------------------------
addBtn.addEventListener("click", function () {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (!category) return alert("Select a category");
    if (isNaN(amount) || amount <= 0) return alert("Enter valid amount");
    if (!date) return alert("Select a date");

    const expense = { category, amount, date };
    expenses.push(expense);
    saveExpenses();

    totalAmount += amount;
    totalAmountCell.textContent = totalAmount;

    addExpenseRow(expense);
    updateChart(expenses);
});

// --------------------------------------
// Add Row to Table
// --------------------------------------
function addExpenseRow(expense) {
    const row = expensesTableBody.insertRow();

    row.insertCell().textContent = expense.category;
    row.insertCell().textContent = expense.amount;
    row.insertCell().textContent = expense.date;

    const delCell = row.insertCell();
    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.classList.add("delete-btn");

    btn.addEventListener("click", function () {
        const index = expenses.indexOf(expense);
        expenses.splice(index, 1);
        saveExpenses();

        totalAmount -= expense.amount;
        totalAmountCell.textContent = totalAmount;

        row.remove();
        updateChart(expenses);
    });

    delCell.appendChild(btn);
}

// --------------------------------------
// Chart.js Pie Chart
// --------------------------------------
function updateChart(expenses) {
    const totals = {};

    expenses.forEach(item => {
        totals[item.category] = (totals[item.category] || 0) + item.amount;
    });

    const labels = Object.keys(totals);
    const data = Object.values(totals);

    const ctx = document.getElementById("expenseChart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    "#ff6384", "#36a2eb", "#ffce56",
                    "#4bc0c0", "#9966ff", "#ff9f40"
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: "bottom" } }
        }
    });
}

// --------------------------------------
// Predict Next Month (Button)
// --------------------------------------
predictBtn.addEventListener("click", function () {
    const result = predictNextMonth(expenses);

    predictionResult.textContent = `Estimated next month spending: ₹${result}`;
});

// --------------------------------------
// EXPORT CSV
// --------------------------------------
document.getElementById("download-csv").addEventListener("click", function () {
    if (expenses.length === 0) return alert("No data!");

    let csv = "Category,Amount,Date\n";
    expenses.forEach(exp => {
        csv += `${exp.category},${exp.amount},${exp.date}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "expenses.csv";
    link.click();
});

// --------------------------------------
// EXPORT EXCEL
// --------------------------------------
document.getElementById("download-excel").addEventListener("click", function () {
    if (expenses.length === 0) return alert("No data!");

    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "expenses.xlsx");
});

// --------------------------------------
// EXPORT PDF
// --------------------------------------
document.getElementById("download-pdf").addEventListener("click", function () {
    if (expenses.length === 0) return alert("No data!");

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Expense Report", 14, 20);

    pdf.autoTable({
        startY: 30,
        head: [["Category", "Amount", "Date"]],
        body: expenses.map(e => [e.category, e.amount, e.date])
    });

    pdf.save("expense_report.pdf");
});