// src/components/TaskList/index.tsx

import React from 'react';
import './style.css';
import type { Task } from '../../types/task';

// TaskListコンポーネントのPropsの型定義
interface TaskListProps {
  // App.tsxでフィルタリング済みのタスクを受け取る
  tasks: Task[]; 
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onDeleteAll: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks, // フィルタリング済みのリストを期待
  onToggleTask,
  onDeleteTask,
  onDeleteAll,
}) => {
  // tasks をそのまま使用します

  return (
    <div className="task-list-container">
      <ul className="task-list">
        {/* 受け取った tasks をそのままマップして表示 */}
        {tasks.map((task) => ( 
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
                  <span className={`priority ${task.priority}`}>{task.priority} </span>
                  <span className={`category ${task.category}`}>{task.category} </span>
                  {/* Dateオブジェクトが渡されることを前提 */}
                  <span className="created-at">
                    {task.createdAt instanceof Date ? task.createdAt.toLocaleDateString() : 'Invalid Date'}
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