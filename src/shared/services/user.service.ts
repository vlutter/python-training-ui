import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { API_URL } from '../constants/api.constants';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private userInfoSubject = new BehaviorSubject<User | null>(null);
  public userInfo$ = this.userInfoSubject.asObservable();

  constructor(private http: HttpClient) {
    this.userInfo$.pipe(
      filter(userInfo => !userInfo),
      switchMap(() => this.getUserInfo())
    ).subscribe();
  }

  getUserInfo(): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.get<any>(`${API_URL}/userInfo`, { headers }).pipe(
      tap(userInfo => {
        this.userInfoSubject.next(userInfo);
      }),
      catchError(error => {
        console.error('Error fetching user info:', error);
        throw error;
      })
    );
  }
}
