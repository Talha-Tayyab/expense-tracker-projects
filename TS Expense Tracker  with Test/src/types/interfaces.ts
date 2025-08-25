// Describes one expense record
export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

// Represents a spending category
export interface Category {
  id?: string; 
  name: string;
  emoji: string;
  color?: string;
  expenses?: { amount: number }[]; 
}

// Budget configuration for the app
export interface BudgetConfig {
  monthlyLimit: number; 
  categoryLimits: Record<string, number>; 
}

// Filters selected by user
export interface FilterCriteria {
  searchText?: string;
  dateFrom?: string;
  dateTo?: string;
  categories?: string[];
  minAmount?: number;
  maxAmount?: number;
}