export interface Task {
  _id?: string;
  id?: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string | null;
  createdAt?: Date;
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export const TASK_STATUSES = [
  { value: 'todo',        label: 'À faire',  color: '#4a90e2', light: '#eef4fd' },
  { value: 'in-progress', label: 'En cours', color: '#f39c12', light: '#fef9ee' },
  { value: 'done',        label: 'Terminé',  color: '#27ae60', light: '#eefaf3' }
];

export const TASK_PRIORITIES = [
  { value: 'low',    label: 'Basse',  color: '#27ae60' },
  { value: 'medium', label: 'Moyenne', color: '#f39c12' },
  { value: 'high',   label: 'Haute',  color: '#e74c3c' }
];