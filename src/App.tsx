import React, { useReducer } from 'react';
import './App.css';
import InputForm from './components/InputForm';
import TaskFilter from './components/TaskFilter';
import type { FilterType } from './components/TaskFilter';
import TaskList from './components/TaskList';
import type { Task } from './types/task';

// タスクの型定義
// src/types/task.ts に配置を想定
// interface Task {
//   id: number;
//   text: string;
//   completed: boolean;
// }

// アクションの型定義
type Action =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'TOGGLE_TASK'; payload: number }
  | { type: 'DELETE_TASK'; payload: number }
  | { type: 'DELETE_ALL_TASKS' };

// Reducer関数
const taskReducer = (state: Task[], action: Action): Task[] => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload];
    case 'TOGGLE_TASK':
      return state.map((task) =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
    case 'DELETE_TASK':
      return state.filter((task) => task.id !== action.payload);
    case 'DELETE_ALL_TASKS':
      return [];
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [filter, setFilter] = React.useState<FilterType>('All');

  const handleAddTask = (task: Task) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const handleToggleTask = (id: number) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  };

  const handleDeleteTask = (id: number) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const handleDeleteAll = () => {
    dispatch({ type: 'DELETE_ALL_TASKS' });
  };

  return (
    <div className="container">
      <h1 className="title">ToDo App</h1>
      <InputForm onAddTask={handleAddTask} />
      <hr />
      <TaskFilter filter={filter} onFilterChange={setFilter} />
      <TaskList
        tasks={tasks}
        filter={filter}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        onDeleteAll={handleDeleteAll}
      />
    </div>
  );
};

export default App;
