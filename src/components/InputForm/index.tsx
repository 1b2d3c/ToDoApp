import React, { useState } from 'react';
import './style.css';
import  type { Task, Priority, Category } from '../../types/task';

// InputFormコンポーネントのPropsの型定義
interface InputFormProps {
  onAddTask: (task: Task) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onAddTask }) => {
  const [taskText, setTaskText] = useState('');
  // 新しく追加：優先度とカテゴリーの状態を管理
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskCategory, setTaskCategory] = useState<Category>('other');

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim() === '') return;

    // 新しいタスクを作成
    const newTask: Task = {
      id: Date.now(),
      text: taskText,
      completed: false,
      // ユーザーが選択した値を使用
      priority: taskPriority,
      category: taskCategory,
      createdAt: new Date(),
    };

    onAddTask(newTask);
    setTaskText(''); // 入力フィールドをクリア
    // 入力完了後、選択項目を初期値に戻す
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
      
      {/* 優先度選択のドロップダウンメニュー */}
      <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value as Priority)}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* カテゴリー選択のドロップダウンメニュー */}
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