// src/components/InputForm/index.tsx

import React, { useState } from 'react';
import './style.css';
import type { Task, Priority, Category } from '../../types/task';
import { PRIORITY_ORDER, CATEGORY_OPTIONS } from '../../constants'; 

// InputFormコンポーネントのPropsの型定義
interface InputFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onAddTask }) => {
  const [taskText, setTaskText] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskCategory, setTaskCategory] = useState<Category>('other');

  // 定数から有効な優先度とカテゴリーの配列を取得
  // PRIORITY_ORDERのキーをPriority型として取得
  const priorities = Object.keys(PRIORITY_ORDER) as Priority[]; 
  // CATEGORY_OPTIONSから 'All' を除いたものをCategory型として取得
  const categories = CATEGORY_OPTIONS.filter(c => c !== 'All') as Category[]; 

  // 優先度の変更ハンドラ
  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // 有効な優先度に含まれているかチェック
    if (priorities.includes(value as Priority)) {
      setTaskPriority(value as Priority); 
    }
  };

  // カテゴリーの変更ハンドラ
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // 有効なカテゴリーに含まれているかチェック
    if (categories.includes(value as Category)) {
      setTaskCategory(value as Category);
    }
  };

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim() === '') return;

    const newTask = {
      text: taskText,
      priority: taskPriority,
      category: taskCategory,
    };

    onAddTask(newTask);
    setTaskText(''); 
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
      {/* 修正されたハンドラを適用 */}
      <select value={taskPriority} onChange={handlePriorityChange}>
        {/* 定数配列からオプションを生成 */}
        {priorities.map((p) => (
          <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
        ))}
      </select>
      {/* 修正されたハンドラを適用 */}
      <select value={taskCategory} onChange={handleCategoryChange}>
        {/* 定数配列からオプションを生成 */}
        {categories.map((c) => (
          <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
        ))}
      </select>
      <button type="submit">submit</button>
    </form>
  );
};

export default InputForm;