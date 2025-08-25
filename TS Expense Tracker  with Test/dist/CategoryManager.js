export class CategoryManager {
    constructor() {
        this.categories = [];
        this.defaultCategories = [
            { name: "Food", emoji: "🍽️" },
            { name: "Transport", emoji: "🚗" },
            { name: "Shopping", emoji: "🛍️" },
            { name: "Entertainment", emoji: "🎬" },
            { name: "Bills", emoji: "📄" },
            { name: "Health", emoji: "🏥" },
            { name: "Other", emoji: "📦" }
        ];
        this.loadCategories();
        this.renderCategories();
        this.attachEventListeners();
    }
    capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }
    generateCategoryId(name) {
        return `${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;
    }
    loadCategories() {
        try {
            const savedData = localStorage.getItem("categories");
            if (!savedData) {
                this.resetToDefaults();
                return;
            }
            const parsed = JSON.parse(savedData);
            if (Array.isArray(parsed) && parsed.length > 0) {
                this.categories = parsed;
            }
            else {
                this.resetToDefaults();
            }
        }
        catch (error) {
            console.warn("Failed to load categories from localStorage:", error);
            this.resetToDefaults();
        }
    }
    resetToDefaults() {
        this.categories = [...this.defaultCategories];
        this.saveCategories();
    }
    saveCategories() {
        try {
            localStorage.setItem("categories", JSON.stringify(this.categories));
        }
        catch (error) {
            console.error("Failed to save categories:", error);
        }
    }
    calculateCategoryStats() {
        let mostUsedCategory = "-";
        let highestSpendCategory = "-";
        let maxCount = 0;
        let maxSpend = 0;
        this.categories.forEach(category => {
            const expenseCount = category.expenses?.length || 0;
            const totalAmount = category.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
            if (expenseCount > maxCount) {
                maxCount = expenseCount;
                mostUsedCategory = this.capitalize(category.name);
            }
            if (totalAmount > maxSpend) {
                maxSpend = totalAmount;
                highestSpendCategory = this.capitalize(category.name);
            }
        });
        return { mostUsedCategory, highestSpendCategory };
    }
    updateStatsDisplay() {
        const stats = this.calculateCategoryStats();
        const totalCategoriesEl = document.getElementById("totalCategories");
        const mostUsedEl = document.getElementById("mostUsed");
        const highestSpendEl = document.getElementById("highestSpend");
        if (totalCategoriesEl)
            totalCategoriesEl.textContent = String(this.categories.length);
        if (mostUsedEl)
            mostUsedEl.textContent = stats.mostUsedCategory;
        if (highestSpendEl)
            highestSpendEl.textContent = stats.highestSpendCategory;
    }
    updateCategorySelect() {
        const categorySelect = document.getElementById("category");
        if (!categorySelect)
            return;
        categorySelect.innerHTML = '<option value="">Select a category</option>';
        this.categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.name;
            option.textContent = `${category.emoji} ${this.capitalize(category.name)}`;
            option.style.fontSize = "16px";
            categorySelect.appendChild(option);
        });
    }
    createCategoryElement(category) {
        const categoryEl = document.createElement("div");
        categoryEl.className = "category-box";
        const totalAmount = category.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
        const expenseCount = category.expenses?.length || 0;
        categoryEl.innerHTML = `
      <div class="category-icon">${category.emoji}</div>
      <div class="category-name">${this.capitalize(category.name)}</div>
      <div class="category-id">ID: ${category.id || "-"}</div>
      <div class="category-info">
        <span>${expenseCount} expenses</span>
        <span>$${totalAmount.toFixed(2)}</span>
      </div>
      <div class="category-actions">
        <button class="btn-small edit-btn" data-id="${category.id}">Edit</button>
        <button class="btn-small delete-btn" data-id="${category.id}">Delete</button>
      </div>
    `;
        return categoryEl;
    }
    renderCategories() {
        const container = document.getElementById("categoryGrid");
        if (!container)
            return;
        // Clear existing content
        container.innerHTML = "";
        // Render category elements
        this.categories.forEach(category => {
            const categoryElement = this.createCategoryElement(category);
            container.appendChild(categoryElement);
        });
        // Update related UI components
        this.updateCategorySelect();
        this.updateStatsDisplay();
    }
    showModal() {
        const modal = document.getElementById("categoryModal");
        if (modal)
            modal.style.display = "block";
    }
    hideModal() {
        const modal = document.getElementById("categoryModal");
        if (modal)
            modal.style.display = "none";
    }
    resetForm() {
        const nameInput = document.getElementById("categoryName");
        const emojiInput = document.getElementById("categoryEmoji");
        if (nameInput)
            nameInput.value = "";
        if (emojiInput)
            emojiInput.value = "";
    }
    handleFormSubmit(event) {
        event.preventDefault();
        const nameInput = document.getElementById("categoryName");
        const emojiInput = document.getElementById("categoryEmoji");
        if (!nameInput || !emojiInput)
            return;
        const name = nameInput.value.trim();
        const emoji = emojiInput.value.trim();
        if (!name || !emoji) {
            alert("Both name and emoji are required.");
            return;
        }
        // Check for duplicate names
        if (this.categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
            alert("A category with this name already exists.");
            return;
        }
        const newCategory = {
            name,
            emoji,
            id: this.generateCategoryId(name),
            expenses: []
        };
        this.categories.push(newCategory);
        this.saveCategories();
        this.renderCategories();
        this.hideModal();
        this.resetForm();
    }
    isDefaultCategory(categoryName) {
        return this.defaultCategories.some(cat => cat.name === categoryName);
    }
    handleDeleteCategory() {
        const currentCategories = this.categories.map(c => c.name);
        const categoryToDelete = prompt("Enter the name of the category to delete:\n\n" + currentCategories.join("\n"));
        if (!categoryToDelete)
            return;
        const trimmedName = categoryToDelete.trim();
        // Prevent deletion of default categories
        if (this.isDefaultCategory(trimmedName)) {
            alert("❌ You cannot delete a default category.");
            return;
        }
        const categoryIndex = this.categories.findIndex(cat => cat.name === trimmedName);
        if (categoryIndex === -1) {
            alert("❌ Category not found.");
            return;
        }
        this.categories.splice(categoryIndex, 1);
        this.saveCategories();
        this.renderCategories();
        alert(`✅ Category "${trimmedName}" deleted successfully.`);
    }
    attachEventListeners() {
        // Modal controls
        document.getElementById("addCategory")?.addEventListener("click", () => this.showModal());
        document.getElementById("cancelCategory")?.addEventListener("click", () => this.hideModal());
        document.getElementById("modalClose")?.addEventListener("click", () => this.hideModal());
        // Form submission
        document.getElementById("categoryForm")?.addEventListener("submit", (e) => this.handleFormSubmit(e));
        // Delete category
        document.getElementById("deleteCategory")?.addEventListener("click", () => this.handleDeleteCategory());
        // Close modal when clicking outside of it
        window.addEventListener("click", (event) => {
            const modal = document.getElementById("categoryModal");
            if (event.target === modal) {
                this.hideModal();
            }
        });
    }
    // Public methods for external use
    getCategories() {
        return [...this.categories];
    }
    getCategoryByName(name) {
        return this.categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
    }
    addExpenseToCategory(categoryName, amount) {
        const category = this.getCategoryByName(categoryName);
        if (!category)
            return false;
        if (!category.expenses)
            category.expenses = [];
        category.expenses.push({ amount });
        this.saveCategories();
        this.renderCategories();
        return true;
    }
    refresh() {
        this.loadCategories();
        this.renderCategories();
    }
}
