import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task';
import { Task } from '../models/task';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const mockTask: Task = {
    _id: '123',
    title: 'Tâche test',
    description: 'Description test',
    status: 'todo',
    priority: 'medium',
    dueDate: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service  = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait charger les tâches depuis l\'API', () => {
    service.loadTasks();
    const req = httpMock.expectOne('http://localhost:3000/api/tasks');
    expect(req.request.method).toBe('GET');
    req.flush([mockTask]);
    service.tasks$.subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe('Tâche test');
    });
  });

  it('devrait ajouter une tâche via POST', () => {
    service.addTask('Nouvelle tâche', 'Description', 'high', null);
    const req = httpMock.expectOne('http://localhost:3000/api/tasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.title).toBe('Nouvelle tâche');
    req.flush(mockTask);
    const reqGet = httpMock.expectOne('http://localhost:3000/api/tasks');
    reqGet.flush([mockTask]);
  });

  it('devrait supprimer une tâche via DELETE', () => {
    service.deleteTask('123');
    const req = httpMock.expectOne('http://localhost:3000/api/tasks/123');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Tâche supprimée' });
    const reqGet = httpMock.expectOne('http://localhost:3000/api/tasks');
    reqGet.flush([]);
  });

  it('devrait mettre à jour le statut via PUT', () => {
    service.updateStatus('123', 'done');
    const req = httpMock.expectOne('http://localhost:3000/api/tasks/123');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.status).toBe('done');
    req.flush({ ...mockTask, status: 'done' });
    const reqGet = httpMock.expectOne('http://localhost:3000/api/tasks');
    reqGet.flush([]);
  });

  it('devrait avoir un tableau vide au démarrage', () => {
    service.tasks$.subscribe(tasks => {
      expect(tasks).toEqual([]);
    });
  });
});