import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;
    requestOptions;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    token = localStorage.getItem('currentUser');

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

    setToken() {
        this.requestOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.currentUserValue
            })
        }
    }

    login(access_token: string) {
        const headers = new HttpHeaders();
        headers.set('Content-Type', 'application/json; charset=utf-8');
        return this.http.post<any>(`${environment.apiUrl}accounts/fb-login/`, { 'access_token': access_token })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                console.log('response from the .login', user);
                localStorage.setItem('currentUser', JSON.stringify(user.key));
                this.currentUserSubject.next(user.key);
                return user.key;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    get(path: string, options: Object = {}): Observable<any> {
        this.setToken();
        return this.http.get<any>(environment.apiUrl+path, this.requestOptions)
        .pipe(map((response: any) => {
           return response;
        }), catchError((error:any) => {
            console.log('error', error);
            return throwError(error);
        }));
    }

    post(path: string, data: Object = {}): Observable<any> {
        this.setToken();
        return this.http.post<any>(environment.apiUrl+path, data, this.requestOptions)
        .pipe(map((response: any) => {
           return response;
        }), catchError((error:any) => {
            console.log('error', error);
            return throwError(error);
        }));
    }

    test() {
        console.log("test token", this.token);
        console.log("current user", this.currentUserValue);
    }
}
