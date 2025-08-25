export class ChartManager {
    /**
     * Initialize charts when dashboard is first shown
     */
    static initializeCharts() {
        this.createPieChart();
        this.createBarChart();
        this.updateCharts();
    }
    /**
     * Set canvas to high DPI to prevent blur - CRITICAL FIX
     */
    static setCanvasHighDPI(canvas) {
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const devicePixelRatio = window.devicePixelRatio || 1;
        const backingStoreRatio = 1;
        const ratio = devicePixelRatio / backingStoreRatio;
        // Get the actual display size from CSS
        const rect = canvas.getBoundingClientRect();
        const displayWidth = rect.width || 400;
        const displayHeight = rect.height || 400;
        // Set the actual size in memory (scaled for high DPI)
        canvas.width = displayWidth * ratio;
        canvas.height = displayHeight * ratio;
        // Scale the canvas back down using CSS
        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';
        // Scale the drawing context so everything draws at the correct size
        ctx.scale(ratio, ratio);
    }
    /**
     * Create the pie chart for expenses by category
     */
    static createPieChart() {
        const canvas = document.getElementById('categoryPieChart');
        if (!canvas) {
            console.error('Canvas element categoryPieChart not found');
            return;
        }
        // ✅ CRITICAL: Apply high DPI fix to prevent blur
        this.setCanvasHighDPI(canvas);
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        this.pieChart = new window.Chart(ctx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                        label: 'Expenses by Category',
                        data: [],
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                            '#9966FF', '#FF9F40', '#e74c3c', '#27ae60'
                        ],
                        borderWidth: 3,
                        borderColor: '#fff',
                        hoverOffset: 8
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                // ✅ CRITICAL: High DPI support
                devicePixelRatio: window.devicePixelRatio || 2,
                plugins: {
                    title: {
                        display: true,
                        text: '💰 Expenses by Category',
                        font: {
                            size: 18,
                            weight: 'bold',
                            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                        },
                        padding: 20,
                        color: '#2c3e50'
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 13,
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            },
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleFont: {
                            size: 14,
                            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                        },
                        bodyFont: {
                            size: 13,
                            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                        },
                        callbacks: {
                            label: function (context) {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 500
                }
            }
        });
    }
    /**
     * Create the bar chart for monthly expenses
     */
    static createBarChart() {
        const canvas = document.getElementById('monthlyBarChart');
        if (!canvas) {
            console.error('Canvas element monthlyBarChart not found');
            return;
        }
        // ✅ CRITICAL: Apply high DPI fix to prevent blur
        this.setCanvasHighDPI(canvas);
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        this.barChart = new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                        label: 'Monthly Expenses',
                        data: [],
                        backgroundColor: '#3498db',
                        borderColor: '#2980b9',
                        borderWidth: 1,
                        borderRadius: 6,
                        borderSkipped: false
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                // ✅ CRITICAL: High DPI support
                devicePixelRatio: window.devicePixelRatio || 2,
                plugins: {
                    title: {
                        display: true,
                        text: '📊 Monthly Expense Totals',
                        font: {
                            size: 18,
                            weight: 'bold',
                            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                        },
                        padding: 20,
                        color: '#2c3e50'
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleFont: {
                            size: 14,
                            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                        },
                        bodyFont: {
                            size: 13,
                            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                        },
                        callbacks: {
                            label: function (context) {
                                return `Total: $${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            font: {
                                size: 12,
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            },
                            color: '#666',
                            callback: function (value) {
                                return '$' + value.toFixed(2);
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 12,
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            },
                            color: '#666'
                        }
                    }
                },
                animation: {
                    duration: 500
                }
            }
        });
    }
    /**
     * Update both charts with current expense data
     */
    static updateCharts() {
        const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
        const categories = JSON.parse(localStorage.getItem("categories") || "[]");
        console.log("Updating charts with", expenses.length, "expenses");
        this.updatePieChart(expenses, categories);
        this.updateBarChart(expenses);
    }
    /**
     * Update pie chart with category totals
     */
    static updatePieChart(expenses, categories) {
        if (!this.pieChart)
            return;
        // Calculate totals by category
        const categoryTotals = {};
        expenses.forEach(expense => {
            if (categoryTotals[expense.category]) {
                categoryTotals[expense.category] += expense.amount;
            }
            else {
                categoryTotals[expense.category] = expense.amount;
            }
        });
        // Prepare chart data
        const labels = [];
        const data = [];
        Object.entries(categoryTotals).forEach(([categoryName, total]) => {
            const category = categories.find(cat => cat.name === categoryName);
            const emoji = category ? category.emoji : "❓";
            const displayName = category ? `${emoji} ${this.capitalize(categoryName)}` : this.capitalize(categoryName);
            labels.push(displayName);
            data.push(total);
        });
        // Handle empty data
        if (labels.length === 0) {
            labels.push('No expenses yet');
            data.push(0);
        }
        // Update chart
        this.pieChart.data.labels = labels;
        this.pieChart.data.datasets[0].data = data;
        this.pieChart.update('active');
    }
    /**
     * Update bar chart with monthly totals
     */
    static updateBarChart(expenses) {
        if (!this.barChart)
            return;
        // Calculate totals by month
        const monthlyTotals = {};
        expenses.forEach(expense => {
            const monthKey = expense.date.substring(0, 7); // Get YYYY-MM
            if (monthlyTotals[monthKey]) {
                monthlyTotals[monthKey] += expense.amount;
            }
            else {
                monthlyTotals[monthKey] = expense.amount;
            }
        });
        // Sort months chronologically and prepare data
        const sortedMonths = Object.keys(monthlyTotals).sort();
        const labels = sortedMonths.map(month => this.formatMonthLabel(month));
        const data = sortedMonths.map(month => monthlyTotals[month]);
        // Handle empty data
        if (labels.length === 0) {
            labels.push('No data');
            data.push(0);
        }
        // Update chart
        this.barChart.data.labels = labels;
        this.barChart.data.datasets[0].data = data;
        this.barChart.update('active');
    }
    /**
     * Format month string (YYYY-MM) to readable format
     */
    static formatMonthLabel(monthString) {
        const [year, month] = monthString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    /**
     * Utility function to capitalize first letter
     */
    static capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
    /**
     * Toggle dashboard visibility
     */
    static toggleDashboard() {
        const dashboard = document.getElementById('chartDashboard');
        if (!dashboard) {
            console.error('Chart dashboard element not found');
            return;
        }
        const isHidden = dashboard.style.display === 'none';
        dashboard.style.display = isHidden ? 'block' : 'none';
        console.log('Dashboard toggled:', isHidden ? 'shown' : 'hidden');
        // Initialize charts when first shown
        if (isHidden && (!this.pieChart || !this.barChart)) {
            console.log('Initializing charts for first time...');
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                this.initializeCharts();
            }, 200);
        }
        else if (!isHidden) {
            // Update charts with latest data
            this.updateCharts();
        }
    }
    /**
     * Destroy charts (cleanup)
     */
    static destroyCharts() {
        if (this.pieChart) {
            this.pieChart.destroy();
            this.pieChart = null;
        }
        if (this.barChart) {
            this.barChart.destroy();
            this.barChart = null;
        }
    }
}
ChartManager.pieChart = null;
ChartManager.barChart = null;
