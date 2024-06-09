import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { API_URL } from '@constants/api.constants';
import { Task, TaskGroup, TaskGroupWithSolutions } from '@models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private taskGroupsSubject = new BehaviorSubject<TaskGroup[]>([]);
  public taskGroups$ = this.taskGroupsSubject.asObservable();

  private userTaskGroupsSubject = new BehaviorSubject<TaskGroupWithSolutions[]>([]);
  public userTaskGroups$ = this.userTaskGroupsSubject.asObservable();

  constructor(private http: HttpClient) {}

  public setTask(newTask: Task): void {
    this.taskGroupsSubject.next(this.taskGroupsSubject.value.map(group => {
      if (!group.tasks.some(task => task.id === newTask.id)) return group;

      group.tasks = group.tasks.map(task => task.id === newTask.id ? newTask : task)

      return group;
    }));
  }

  getTasksByUser(userId: number): Observable<TaskGroupWithSolutions[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.get<TaskGroup[]>(`${API_URL}/tasks/user/${userId}`, { headers }).pipe(
      tap(taskGroups => {
        this.userTaskGroupsSubject.next(taskGroups);
      }),
      catchError(error => {
        console.error('Error fetching user tasks:', error);
        throw error;
      })
    );
  }

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

  getGroupById(groupId: number): Observable<TaskGroup> {
    return this.taskGroups$.pipe(
      map(taskGroups => taskGroups.find(group => group.id === groupId)),
      filter(group => group !== undefined),
      map(group => group as TaskGroup),
      catchError(error => {
        console.error(`Error finding task group with id ${groupId} in subject:`, error);
        return throwError(error);
      })
    );
  }

  createGroup(groupName: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    const body = { name: groupName };

    return this.http.post<any>(`${API_URL}/tasks/group`, body, { headers }).pipe(
      tap(() => {
        this.getTasks().subscribe();
      }),
      catchError(error => {
        console.error('Error creating task:', error);
        throw error;
      })
    );
  }

  editGroup(groupId: number, name: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.put<any>(`${API_URL}/tasks/group/${groupId}`, { name }, { headers }).pipe(
      tap(() => {
        this.getTasks().subscribe();
      }),
      catchError(error => {
        console.error('Error editing task:', error);
        throw error;
      })
    );
  }

  deleteGroup(groupId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.delete<any>(`${API_URL}/tasks/group/${groupId}`, { headers }).pipe(
      tap(() => {
        this.getTasks().subscribe();
      }),
      catchError(error => {
        console.error('Error deleting task:', error);
        throw error;
      })
    );
  }

  createTask(task: Task): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.post<any>(`${API_URL}/tasks`, task, { headers }).pipe(
      tap(() => {
        this.taskGroupsSubject.next(this.taskGroupsSubject.getValue().map((group) => {
          if (group.id !== task.group_id) return group;

          return {
            ...group,
            tasks: [...group.tasks, task]
          };
        }));
      }),
      catchError(error => {
        console.error('Error creating task:', error);
        throw error;
      })
    );
  }

  editTask(task: Task): Observable<any> {    
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.put<any>(`${API_URL}/tasks/${task.id}`, task, { headers }).pipe(
      tap(() => {
        this.taskGroupsSubject.next(this.taskGroupsSubject.getValue().map((group) => {
          if (group.id !== task.group_id) return group;

          return {
            ...group,
            tasks: group.tasks.map((currentTask) => currentTask.id === task.id ? task : currentTask)
          };
        }));
      }),
      catchError(error => {
        console.error('Error editing task:', error);
        throw error;
      })
    );
  }

  deleteTask(taskId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.delete<any>(`${API_URL}/tasks/${taskId}`, { headers }).pipe(
      tap(() => {
        this.getTasks().subscribe();
      }),
      catchError(error => {
        console.error('Error deleting task:', error);
        throw error;
      })
    );
  }
}
