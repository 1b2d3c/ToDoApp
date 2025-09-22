export type Priority = 'high' | 'medium' | 'low';
export type Category = 'work' | 'personal' | 'shopping' | 'other';

export interface Task {
    id: string;
    text: string;
    completed: boolean;
    priority: Priority;
    category: Category;
    createdAt: Date;
  }