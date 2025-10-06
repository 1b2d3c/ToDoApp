// src/constants.ts
import type { StatusFilter, CategoryFilter, Priority } from './types/task';

// 優先度の順序付けに使用する定数 (レビュー 3.5)
// key-valueの型をRecord<Priority, number>として定義
export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 1,
  medium: 2,
  low: 3
} as const;

// ステータスフィルターオプション (レビュー 3.5)
export const STATUS_OPTIONS: StatusFilter[] = ['All', 'ToDo', 'Done'];

// カテゴリーフィルターオプション (レビュー 3.5)
export const CATEGORY_OPTIONS: CategoryFilter[] = ['All', 'work', 'personal', 'shopping', 'other'];