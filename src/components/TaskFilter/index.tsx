// src/components/TaskFilter/index.tsx

import React from 'react';
import './style.css';
import type { StatusFilter, CategoryFilter } from '../../types/task';

interface TaskFilterProps {
  statusFilter: StatusFilter;
  categoryFilter: CategoryFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
  onCategoryFilterChange: (filter: CategoryFilter) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ 
  statusFilter,
  categoryFilter,
  onStatusFilterChange,
  onCategoryFilterChange,
}) => {
  const statusOptions: StatusFilter[] = ['All', 'ToDo', 'Done'];
  const categoryOptions: CategoryFilter[] = ['All', 'work', 'personal', 'shopping', 'other'];

  return (
    <div className="task-filter">
    {/* カテゴリーフィルターのドロップダウン */}
    <span className="label">category:</span>
    <select
      value={categoryFilter}
      onChange={(e) => onCategoryFilterChange(e.target.value as CategoryFilter)}
      className="category-select"
    >
      {categoryOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>

      {/* ステータスフィルターのドロップダウン */}
      <span className="label">completed:</span>
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
        className="status-select"
      >
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TaskFilter;