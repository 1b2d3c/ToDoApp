import React from 'react';
import './style.css';
import type { FilterType } from '../../types/task';

interface TaskFilterProps {
  onFilterChange: (filter: FilterType) => void;
  currentFilter: FilterType;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ currentFilter, onFilterChange }) => {
  // フィルターオプションにカテゴリーを追加
  const filterOptions: FilterType[] = ['All', 'ToDo', 'Done', 'work', 'personal', 'shopping', 'other'];

  return (
    <div className="task-filter">
      {filterOptions.map((option) => (
        <label key={option}>
          <input
            type="radio"
            name="filter"
            value={option}
            checked={currentFilter === option}
            onChange={() => onFilterChange(option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default TaskFilter;