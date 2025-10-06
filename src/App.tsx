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
import TaskFilter from './components/TaskFilter';

import { PRIORITY_ORDER } from './constants';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');

  // Firestoreからタスクを取得（Read）
  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));

    // Firestore側がエラーを出す可能性は低いが、必要に応じて外側で処理。
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
          // FirestoreのTimestamp型をDate型に変換
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(), 
        });
      });

      tasksArray.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
      setTasks(tasksArray);
    }, (error) => {
      // リアルタイムリスナーのエラーハンドリング
      console.error('Firestoreリスナーエラー:', error);
      alert('タスクデータの取得中にエラーが発生しました。');
    });

    return () => unsubscribe();
  }, []);

  // 新しいタスクを追加（Create）
  const handleAddTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    try {
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
    } catch (error) {
      console.error('タスクの追加に失敗しました：', error);
      alert('タスクの追加に失敗しました。もう一度お試しください。');
    }
  };

  // タスクの完了状態を切り替え（Update）
  const handleToggleTask = async (id: string) => {
    try { 
      const taskDocRef = doc(db, 'tasks', id);
      const taskToToggle = tasks.find((task) => task.id === id);
      if (taskToToggle) {
        await updateDoc(taskDocRef, {
          completed: !taskToToggle.completed,
        });
      }
    } catch (error) {
      console.error('タスクの更新に失敗しました：', error);
      alert('タスクの更新に失敗しました。もう一度お試しください。');
    }
  };

  // タスクを削除（Delete）
  const handleDeleteTask = async (id: string) => {
    try { 
      const taskDocRef = doc(db, 'tasks', id);
      await deleteDoc(taskDocRef);
    } catch (error) {
      console.error('タスクの削除に失敗しました：', error);
      alert('タスクの削除に失敗しました。もう一度お試しください。');
    }
  };

  // すべてのタスクを削除（Delete All）
  const handleDeleteAll = async () => {
    if (!window.confirm('本当に全てのタスクを削除しますか？')) {
      return;
    }

    try {
      const taskDocs = tasks.map((task) => doc(db, 'tasks', task.id));
      
      await Promise.all(taskDocs.map(taskDoc => deleteDoc(taskDoc)));
      
      alert('全てのタスクを削除しました。');
    } catch (error) {
      console.error('一括削除に失敗しました：', error);
      alert('一括削除に失敗しました。もう一度お試しください。');
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
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        onDeleteAll={handleDeleteAll}
      />
    </div>
  );
};

export default App;