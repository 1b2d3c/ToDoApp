import React, { useState, useEffect } from 'react';
import './App.css';
import type { Task } from './types/task';
import type { FilterType } from './types/task';
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
import { db } from './firebase'; // 作成したfirebase.tsからdbをインポート

import TaskList from './components/TaskList';
import InputForm from './components/InputForm';
import TaskFilter from './components/TaskFilter';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('All');

  // Firestoreからタスクを取得（Read）
  useEffect(() => {
    // 'tasks'というコレクションへの参照を作成
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksArray: Task[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasksArray.push({
          id: doc.id, // FirestoreのドキュメントIDをタスクIDとして使用
          text: data.text,
          completed: data.completed,
          priority: data.priority,
          category: data.category,
          createdAt: data.createdAt.toDate(),
        });
      });

    // 'high', 'medium', 'low' の順序を手動で設定
    const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
      tasksArray.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      setTasks(tasksArray);
    });
    // クリーンアップ関数: コンポーネントがアンマウントされたときにリスナーを停止
    return () => unsubscribe();
  }, []); // 依存配列が空なので、コンポーネントのマウント時に一度だけ実行

  // 新しいタスクを追加（Create）
  const handleAddTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    // 1. 重複チェッククエリを作成
    const q = query(collection(db, 'tasks'), where('text', '==', taskData.text));
    
    // 2. クエリを実行して重複をチェック
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // 3. 重複が見つかった場合
      alert('同じ名前のタスクは既に追加されています。');
      return;
    }

    // 4. 重複がなければ、タスクを追加
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
    // 複数のドキュメントをまとめて削除する処理
    for (const taskDoc of taskDocs) {
      await deleteDoc(taskDoc);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'ToDo') {
      return !task.completed;
    }
    if (filter === 'Done') {
      return task.completed;
    }
    // カテゴリーフィルターのロジックを追加
    if (filter === 'work' || filter === 'personal' || filter === 'shopping' || filter === 'other') {
      return task.category === filter;
    }
    return true;
  });

  return (
    <div className="container">
      <h1>Todo App</h1>
      <InputForm onAddTask={handleAddTask} />
      <TaskFilter onFilterChange={setFilter} currentFilter={filter} />
      <TaskList
        tasks={filteredTasks}
        filter={filter}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        onDeleteAll={handleDeleteAll}
      />
    </div>
  );
};

export default App;