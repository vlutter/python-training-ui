import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '@constants/api.constants';
import { Task, TaskSolution } from '@models/task.model';
import { TasksService } from './tasks.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private taskSubject = new BehaviorSubject<Task | undefined>(undefined);
  public task$ = this.taskSubject.asObservable();
  private taskSolutionsSubject = new BehaviorSubject<TaskSolution[]>([]);
  public taskSolutions$ = this.taskSolutionsSubject.asObservable();

  constructor(private http: HttpClient, private tasksService: TasksService) {}

  public setTask(task: Task): void {
    this.taskSubject.next(task);

    this.tasksService.setTask(task);
  }

  getTask(id: string): Observable<Task> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.get<Task>(`${API_URL}/tasks/${id}`, { headers }).pipe(
      tap(task => {
        this.taskSubject.next(task);
      }),
      catchError(error => {
        console.error('Error fetching task:', error);
        throw error;
      })
    );
  }

  getTaskSolutions(id: string): Observable<TaskSolution[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.get<TaskSolution[]>(`${API_URL}/tasks/${id}/solutions`, { headers }).pipe(
      tap(taskSolutions => {
        this.taskSolutionsSubject.next(taskSolutions);
      }),
      catchError(error => {
        console.error('Error fetching task solutions:', error);
        throw error;
      })
    );
  }

  runCode(code: string, inputData: string, taskId: string): Observable<{ output_data: string }> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.post<{ output_data: string }>(`${API_URL}/run/${taskId}`, {
      code,
      input_data: inputData
    }, { headers });
  }

  testTask(code: string, taskId: string): Observable<{ status: string }> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.post<{ status: string }>(`${API_URL}/test/${taskId}`, { code }, { headers });
  }
}
