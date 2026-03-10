import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Task } from '../../models/task';
import { TaskCardComponent } from '../task-card/task-card';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, DragDropModule],
  templateUrl: './column.html',
  styleUrl: './column.scss',
  host: {
    'style': 'flex: 1; min-width: 0; display: block;'
  }
})
export class ColumnComponent {

  @Input() title!: string;
  @Input() tasks!: Task[];
  @Input() status!: string;
  @Input() connectedTo: string[] = [];
  @Input() color: string = '#4a90e2';
  @Input() lightColor: string = '#eef4fd';

  @Output() editTask    = new EventEmitter<Task>();
  @Output() deleteTask  = new EventEmitter<string>();  // string au lieu de number
  @Output() taskDropped = new EventEmitter<CdkDragDrop<Task[]>>();

  onEditTask(task: Task): void {
    this.editTask.emit(task);
  }

  onDeleteTask(taskId: string): void {
    this.deleteTask.emit(taskId);
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    this.taskDropped.emit(event);
  }
}