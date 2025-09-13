import React from 'react';
import './style.css';

// フィルターオプションの型定義
export type FilterType = 'All' | 'ToDo' | 'Done';

// TaskFilterコンポーネントのPropsの型定義
interface TaskFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ filter, onFilterChange }) => {
  return (
    <div className="task-filter">
      {(['All', 'ToDo', 'Done'] as FilterType[]).map((option) => (
        <label key={option}>
          <input
            type="radio"
            name="filter"
            value={option}
            checked={filter === option}
            onChange={() => onFilterChange(option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default TaskFilter;
