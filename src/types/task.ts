export type Priority = 'high' | 'medium' | 'low';
export type Category = 'work' | 'personal' | 'shopping' | 'other';
export type StatusFilter = 'All' | 'ToDo' | 'Done' | 'work' | 'personal' | 'shopping' | 'other';
export type CategoryFilter = 'All' | Category;

export interface Task {
    id: string;
    text: string;
    completed: boolean;
    priority: Priority;
    category: Category;
    createdAt: Date;
  }