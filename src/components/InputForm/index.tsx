import React, { useState } from 'react';
import './style.css';
import  type { Task, Priority, Category } from '../../types/task';

// InputFormコンポーネントのPropsの型定義
interface InputFormProps {
  // onAddTask関数がidを含まないタスクデータを受け取るように修正
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onAddTask }) => {
  const [taskText, setTaskText] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskCategory, setTaskCategory] = useState<Category>('other');

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim() === '') return;

    // 新しいタスクを作成（idとcompletedはFirebaseで設定されるため除外）
    const newTask = {
      text: taskText,
      priority: taskPriority,
      category: taskCategory,
    };

    onAddTask(newTask);
    setTaskText(''); // 入力フィールドをクリア
    setTaskPriority('medium');
    setTaskCategory('other');
  };

  return (
    <form className="input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add New Task"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      />
      <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value as Priority)}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select value={taskCategory} onChange={(e) => setTaskCategory(e.target.value as Category)}>
        <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="shopping">Shopping</option>
        <option value="other">Other</option>
      </select>
      <button type="submit">submit</button>
    </form>
  );
};

export default InputForm;