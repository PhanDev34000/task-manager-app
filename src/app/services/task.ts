import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Task, TaskStatus } from '../models/task';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = `${environment.apiUrl}/tasks`;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {
 
}



  // --- Charger toutes les tâches ---
  loadTasks(): void {
    this.http.get<Task[]>(this.apiUrl).subscribe({
    next: (tasks) => {
      this.tasksSubject.next(tasks);
    },
    error: (err) => {
      console.error('❌ Erreur loadTasks :', err);
    }
  });
}
  // --- Créer une tâche ---
  addTask(title: string, description: string, priority: string = 'medium', dueDate: string | null = null): void {
   this.http.post<Task>(this.apiUrl, { title, description, status: 'todo', priority, dueDate })
    .subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erreur addTask:', err)
    });
}

  // --- Modifier une tâche ---
  updateTask(task: Task): void {
  this.http.put<Task>(`${this.apiUrl}/${task._id}`, task)
    .subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erreur updateTask:', err)
    });
  }
  // --- Changer le statut ---
  updateStatus(taskId: string, status: TaskStatus): void {
  this.http.put<Task>(`${this.apiUrl}/${taskId}`, { status })
    .subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erreur updateStatus:', err)
    });
  }

  // --- Supprimer une tâche ---
  deleteTask(taskId: string): void {
  this.http.delete(`${this.apiUrl}/${taskId}`)
    .subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erreur deleteTask:', err)
    });
  }
}