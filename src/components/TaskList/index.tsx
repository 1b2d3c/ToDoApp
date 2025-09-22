import React from 'react';
import './style.css';
import type { Task } from '../../types/task';
import type { FilterType } from '../TaskFilter';

// TaskListコンポーネントのPropsの型定義
interface TaskListProps {
  tasks: Task[];
  filter: FilterType;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onDeleteAll: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  onToggleTask,
  onDeleteTask,
  onDeleteAll,
}) => {
  // フィルターされたタスクを取得
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'ToDo') {
      return !task.completed;
    }
    if (filter === 'Done') {
      return task.completed;
    }
    return true; // 'All'の場合
  });

  return (
    <div className="task-list-container">
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-content">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
              />
              <div className="task-details">
                {/* タスクのテキスト */}
                <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                  {task.text}
                </span>

                {/* タスクの追加情報（優先度、カテゴリー、作成日） */}
                <div className="task-meta">
                  <span className={`priority ${task.priority}`}>{task.priority}</span>
                  <span className="category">{task.category}</span>
                  <span className="created-at">
                    {task.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <button className="delete-btn" onClick={() => onDeleteTask(task.id)}>
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="delete-all-container">
        <button className="delete-all-btn" onClick={onDeleteAll}>
          delete all
        </button>
      </div>
    </div>
  );
};

export default TaskList;