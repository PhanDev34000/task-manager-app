import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TASK_PRIORITIES } from '../../models/task';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskFormComponent implements OnInit {

  @Input()  taskToEdit: Task | null = null;
  @Output() formSubmit = new EventEmitter<{ title: string; description: string; priority: string; dueDate: string | null; task?: Task }>();
  @Output() formCancel = new EventEmitter<void>();

  title       = '';
  description = '';
  priority    = 'medium';
  dueDate     = '';

  priorities  = TASK_PRIORITIES;

  ngOnInit(): void {
    if (this.taskToEdit) {
      this.title       = this.taskToEdit.title;
      this.description = this.taskToEdit.description;
      this.priority    = this.taskToEdit.priority || 'medium';
      this.dueDate     = this.taskToEdit.dueDate
        ? new Date(this.taskToEdit.dueDate).toISOString().split('T')[0]
        : '';
    }
  }

  onSubmit(): void {
    if (!this.title.trim()) return;
    this.formSubmit.emit({
      title:       this.title.trim(),
      description: this.description.trim(),
      priority:    this.priority,
      dueDate:     this.dueDate || null,
      task:        this.taskToEdit ?? undefined
    });
    this.reset();
  }

  onCancel(): void {
    this.formCancel.emit();
    this.reset();
  }

  private reset(): void {
    this.title       = '';
    this.description = '';
    this.priority    = 'medium';
    this.dueDate     = '';
  }
}