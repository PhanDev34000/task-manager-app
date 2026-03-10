import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss'
})
export class TaskCardComponent {

  @Input()  task!: Task;
  @Output() editTask   = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<string>();  // string au lieu de number

  onEdit(): void {
    this.editTask.emit(this.task);
  }

  onDelete(): void {
    this.deleteTask.emit(this.task._id);  // _id au lieu de id
  }
}