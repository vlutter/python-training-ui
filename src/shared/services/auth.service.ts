import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '@constants/api.constants';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    });
    

    return this.http.post<any>(`${API_URL}/login`, {}, { headers }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.loggedInSubject.next(true);
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${API_URL}/register`, { name, email, password }).pipe(
      tap(response => {
        console.log('Registration successful:', response);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        throw error;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false);
  }

  private checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.loggedInSubject.next(true);
    }
  }
}
