import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '@constants/api.constants';
import { Task } from '@models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private taskSubject = new BehaviorSubject<Task | undefined>(undefined);
  public task$ = this.taskSubject.asObservable();

  constructor(private http: HttpClient) {}

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

  runCode(code: string, inputData: string): Observable<{ output_data: string }> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.post<{ output_data: string }>(`${API_URL}/run`, {
      code,
      input_data: inputData
    }, { headers });
  }

  testTask(code: string, taskId: string): Observable<{ status: string }> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.post<{ status: string }>(`${API_URL}/run/${taskId}`, { code }, { headers });
  }
}
