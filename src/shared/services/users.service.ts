import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { API_URL } from '../constants/api.constants';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  private userSubject = new BehaviorSubject<User | undefined>(undefined);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.users$.pipe(
      filter(userInfo => !userInfo),
      switchMap(() => this.getUsers())
    ).subscribe();
  }

  public getUser(userId: number): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.get<User>(`${API_URL}/users/${userId}`, { headers }).pipe(
      tap(user => {
        this.userSubject.next(user);
      }),
      catchError(error => {
        console.error('Error fetching users:', error);
        throw error;
      })
    );
  }

  public getUsers(): Observable<User[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.get<any>(`${API_URL}/users`, { headers }).pipe(
      tap(users => {
        this.usersSubject.next(users);
      }),
      catchError(error => {
        console.error('Error fetching users:', error);
        throw error;
      })
    );
  }
}
