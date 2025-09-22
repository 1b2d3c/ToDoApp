// src/App.tsx

import React, { useState, useEffect } from 'react';
import './App.css';
import type { Task, StatusFilter, CategoryFilter } from './types/task';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';

import TaskList from './components/TaskList';
import InputForm from './components/InputForm';
import TaskFilter from './components/TaskFilter'; // TaskFilterは2つの選択欄を持つように変更します

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  // フィルターのステートを2つに分割
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');

  // Firestoreからタスクを取得（Read）
  useEffect(() => {
    // クエリは一旦シンプルに
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksArray: Task[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasksArray.push({
          id: doc.id,
          text: data.text,
          completed: data.completed,
          priority: data.priority,
          category: data.category,
          createdAt: data.createdAt.toDate(),
        });
      });


    const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
      tasksArray.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      setTasks(tasksArray);
    });
    return () => unsubscribe();
  }, []);

  // 新しいタスクを追加（Create）
  const handleAddTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const q = query(collection(db, 'tasks'), where('text', '==', taskData.text));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert('同じ名前のタスクは既に追加されています。');
      return;
    }

    await addDoc(collection(db, 'tasks'), {
      ...taskData,
      completed: false,
      createdAt: new Date(),
    });
  };

  // タスクの完了状態を切り替え（Update）
  const handleToggleTask = async (id: string) => {
    const taskDocRef = doc(db, 'tasks', id);
    const taskToToggle = tasks.find((task) => task.id === id);
    if (taskToToggle) {
      await updateDoc(taskDocRef, {
        completed: !taskToToggle.completed,
      });
    }
  };

  // タスクを削除（Delete）
  const handleDeleteTask = async (id: string) => {
    const taskDocRef = doc(db, 'tasks', id);
    await deleteDoc(taskDocRef);
  };

  // すべてのタスクを削除（Delete All）
  const handleDeleteAll = async () => {
    const taskDocs = tasks.map((task) => doc(db, 'tasks', task.id));
    for (const taskDoc of taskDocs) {
      await deleteDoc(taskDoc);
    }
  };

  // 複数のフィルターを組み合わせるロジック
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = 
      (statusFilter === 'All') ||
      (statusFilter === 'ToDo' && !task.completed) ||
      (statusFilter === 'Done' && task.completed);
    
    const matchesCategory = 
      (categoryFilter === 'All') ||
      (task.category === categoryFilter);

    return matchesStatus && matchesCategory;
  });

  return (
    <div className="container">
      <h1>Todo App</h1>
      <InputForm onAddTask={handleAddTask} />
      <TaskFilter
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        onStatusFilterChange={setStatusFilter}
        onCategoryFilterChange={setCategoryFilter}
      />
      <TaskList
        tasks={filteredTasks}
        filter={statusFilter} // TaskListに渡すfilterをstatusFilterに変更
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        onDeleteAll={handleDeleteAll}
      />
    </div>
  );
};

export default App;