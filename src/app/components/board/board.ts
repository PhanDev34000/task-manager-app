import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Task, TASK_STATUSES, TaskStatus } from '../../models/task';
import { TaskService } from '../../services/task';
import { AuthService } from '../../services/auth';
import { ColumnComponent } from '../column/column';
import { TaskFormComponent } from '../task-form/task-form';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, ColumnComponent, TaskFormComponent],
  templateUrl: './board.html',
  styleUrl: './board.scss'
})
export class BoardComponent implements OnInit {

  columns   = TASK_STATUSES;
  allTasks: Task[] = [];
  showForm     = false;
  taskToEdit: Task | null = null;
  columnIds = TASK_STATUSES.map(c => c.value);
  username  = '';

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private cdr:         ChangeDetectorRef
  ) {}

  todoTasks:       Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks:       Task[] = [];

  ngOnInit(): void {
    const user    = this.authService.getCurrentUser();
    this.username = user?.username || '';

    this.taskService.tasks$.subscribe(tasks => {
      this.allTasks       = [...tasks];
      this.todoTasks       = tasks.filter(t => t.status === 'todo');
      this.inProgressTasks = tasks.filter(t => t.status === 'in-progress');
      this.doneTasks       = tasks.filter(t => t.status === 'done');
      this.cdr.detectChanges();
      this.cdr.markForCheck();
    });
    this.taskService.loadTasks();
  }

  getTasksByStatus(status: string): Task[] {
    switch(status) {
      case 'todo':        return this.todoTasks;
      case 'in-progress': return this.inProgressTasks;
      case 'done':        return this.doneTasks;
      default:            return [];
    }
  }

  getConnectedColumns(currentStatus: string): string[] {
    return this.columnIds.filter(id => id !== currentStatus);
  }

  openForm(): void {
    this.taskToEdit = null;
    this.showForm   = true;
  }

  onEditTask(task: Task): void {
    this.taskToEdit = task;
    this.showForm   = true;
  }

  onDeleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId);
  }

  onFormSubmit(data: { title: string; description: string; priority: string; dueDate: string | null; task?: Task }): void {
    if (data.task) {
      this.taskService.updateTask({
        ...data.task,
        title:       data.title,
        description: data.description,
        priority:    data.priority as any,
        dueDate:     data.dueDate
      });
    } else {
      this.taskService.addTask(data.title, data.description, data.priority, data.dueDate);
    }
    this.showForm = false;
  }

  onFormCancel(): void {
    this.showForm = false;
  }

  onLogout(): void {
    this.authService.logout();
  }

  onTaskDropped(event: CdkDragDrop<Task[]>, newStatus: string): void {
    if (event.previousContainer !== event.container) {
      const task = event.item.data as Task;
      this.taskService.updateStatus(task._id!, newStatus as TaskStatus);
    }
  }
}