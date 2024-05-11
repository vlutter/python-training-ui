import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '@constants/api.constants';
import { TaskGroup } from '@models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private taskGroupsSubject = new BehaviorSubject<TaskGroup[]>([]);
  public taskGroups$ = this.taskGroupsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getTasks(): Observable<TaskGroup[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.get<TaskGroup[]>(`${API_URL}/tasks`, { headers }).pipe(
      tap(taskGroups => {
        this.taskGroupsSubject.next(taskGroups);
      }),
      catchError(error => {
        console.error('Error fetching tasks:', error);
        throw error;
      })
    );
  }
}
